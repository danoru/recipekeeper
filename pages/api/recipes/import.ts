import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/data/db";
import { recipeHref } from "@/data/helpers";
import { createImportedRecipe, findRecipeByUrl } from "@/data/imports";
import { requireApiUser } from "@/lib/auth";
import { extractPageData, parseRecipe, type PageData } from "@/lib/import/jsonld";
import { sanitizeImportedRecipe, sanitizePageData } from "@/lib/import/sanitize";
import { parseHttpUrl } from "@/lib/import/url";

// The bookmarklet posts a page's JSON-LD, which can be large.
export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

/** Builds the preview the import form shows before saving. */
async function preview(page: PageData) {
  const recipe = parseRecipe(page);
  if (!recipe) return null;

  const [existingCreator, existingRecipe] = await Promise.all([
    prisma.creators.findUnique({
      where: { link: recipe.creatorLink },
      select: { name: true, link: true, image: true },
    }),
    findRecipeByUrl(page.url),
  ]);

  return {
    recipe,
    creatorExists: !!existingCreator,
    existingCreator,
    existingRecipe: existingRecipe
      ? {
          name: existingRecipe.name,
          href: recipeHref(existingRecipe.creatorId, existingRecipe.name),
        }
      : null,
  };
}

const NO_RECIPE =
  "No structured recipe data found on this page. The site may not support Schema.org markup.";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Importing fetches arbitrary URLs server-side, so it is limited to signed-in users.
  const user = await requireApiUser(req, res);
  if (!user) return;

  // GET ?url= — fetch the page server-side and preview it.
  if (req.method === "GET") {
    const url = parseHttpUrl(req.query.url)?.toString();
    if (!url) return res.status(400).json({ error: "A valid http(s) url is required" });

    try {
      const fetchRes = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RecipeImporter/1.0; +https://savry.app)",
        },
        signal: AbortSignal.timeout(10_000),
      });
      if (!fetchRes.ok) {
        return res.status(422).json({
          error: `Could not fetch page (${fetchRes.status}). If the site blocks importers, try the "Save to Savry" bookmarklet from the page itself.`,
        });
      }
      const result = await preview(extractPageData(await fetchRes.text(), url));
      return result ? res.status(200).json(result) : res.status(422).json({ error: NO_RECIPE });
    } catch (err) {
      console.error("[import-recipe GET]", err);
      return res.status(500).json({ error: "Failed to fetch or parse the URL." });
    }
  }

  // POST { page } — preview data captured by the bookmarklet in the user's browser.
  if (req.body?.page) {
    const page = sanitizePageData(req.body.page);
    if (!page) return res.status(400).json({ error: "Invalid page data" });
    const result = await preview(page);
    return result ? res.status(200).json(result) : res.status(422).json({ error: NO_RECIPE });
  }

  // POST { recipe } — save after the user confirms.
  const recipe = sanitizeImportedRecipe(req.body?.recipe);
  if (!recipe) return res.status(400).json({ error: "Invalid recipe data" });

  try {
    const existing = await findRecipeByUrl(recipe.link);
    if (existing) {
      return res.status(409).json({
        error: "This recipe is already on Savry.",
        href: recipeHref(existing.creatorId, existing.name),
      });
    }

    const created = await createImportedRecipe(recipe);
    await Promise.allSettled([
      res.revalidate("/creators"),
      res.revalidate(`/creators/${created.creatorId}`),
    ]);
    return res.status(200).json({
      success: true,
      recipe: { ...created, href: recipeHref(created.creatorId, created.name) },
    });
  } catch (err) {
    console.error("[import-recipe POST]", err);
    return res.status(500).json({ error: "Database error while saving recipe." });
  }
}
