import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../src/data/db";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JsonLdRecipe {
  "@type"?: string | string[];
  name?: string;
  description?: string;
  image?: string | { url?: string } | Array<string | { url?: string }>;
  recipeCategory?: string | string[];
  recipeCuisine?: string | string[];
  recipeYield?: string | string[];
  cookingMethod?: string | string[];
  suitableForDiet?: string | string[];
  author?: { name?: string; url?: string } | string;
  url?: string;
}

interface ParsedRecipe {
  name: string;
  description: string;
  image: string;
  category: string;
  cuisine: string;
  course: string;
  method: string;
  diet: string;
  link: string;
  creatorName: string;
  creatorLink: string;
  creatorWebsite: string;
  creatorImage: string;
  creatorInstagram: string;
  creatorYoutube: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function firstString(val: unknown): string {
  if (!val) return "";
  if (Array.isArray(val)) return String(val[0] ?? "");
  if (typeof val === "object" && val !== null && "url" in val)
    return String((val as { url?: string }).url ?? "");
  return String(val);
}

function extractImage(img: JsonLdRecipe["image"]): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (Array.isArray(img)) {
    const first = img[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first !== null) return first.url ?? "";
  }
  if (typeof img === "object" && "url" in img) return img.url ?? "";
  return "";
}

function creatorSlugFromUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "").replace(/\.[^.]+$/, "");
  } catch {
    return url
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 40);
  }
}

function normalise(value: string): string {
  return value.trim() || "Unknown";
}

function extractJsonLd(html: string): JsonLdRecipe | null {
  const scriptRegex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const raw = JSON.parse(match[1]);
      const candidates: JsonLdRecipe[] = Array.isArray(raw["@graph"])
        ? raw["@graph"]
        : [raw];
      for (const node of candidates) {
        const type = node["@type"];
        const types = Array.isArray(type) ? type : [type];
        if (types.includes("Recipe")) return node as JsonLdRecipe;
      }
    } catch {
      // malformed JSON — skip
    }
  }
  return null;
}

function extractOgImage(html: string): string {
  const match = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  return match?.[1] ?? "";
}

function mapToSchema(
  recipe: JsonLdRecipe,
  pageUrl: string,
  html: string,
): ParsedRecipe {
  const authorRaw = recipe.author;
  const authorName =
    typeof authorRaw === "object" && authorRaw !== null
      ? (authorRaw.name ?? "")
      : typeof authorRaw === "string"
        ? authorRaw
        : "";
  const authorUrl =
    typeof authorRaw === "object" && authorRaw !== null
      ? (authorRaw.url ?? "")
      : "";

  let creatorWebsite = authorUrl;
  if (!creatorWebsite) {
    try {
      creatorWebsite = new URL(pageUrl).origin;
    } catch {
      creatorWebsite = pageUrl;
    }
  }

  const creatorLink = creatorSlugFromUrl(creatorWebsite || pageUrl);
  const ogSiteName =
    html.match(
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ?? "";
  const creatorName = authorName || ogSiteName || creatorLink;
  const image = extractImage(recipe.image) || extractOgImage(html);
  const rawDiet = firstString(recipe.suitableForDiet);
  const diet = rawDiet.replace(/https?:\/\/schema\.org\//i, "") || "None";

  return {
    name: normalise(firstString(recipe.name)),
    description: normalise(firstString(recipe.description)),
    image,
    category: normalise(firstString(recipe.recipeCategory)),
    cuisine: normalise(firstString(recipe.recipeCuisine)),
    course: normalise(firstString(recipe.recipeYield) ? "Main" : "Unknown"),
    method: normalise(firstString(recipe.cookingMethod)),
    diet: normalise(diet),
    link: pageUrl,
    creatorName: normalise(creatorName),
    creatorLink,
    creatorWebsite,
    creatorImage: "",
    creatorInstagram: "",
    creatorYoutube: "",
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // GET — preview without saving
  if (req.method === "GET") {
    const url = req.query.url as string | undefined;
    if (!url) return res.status(400).json({ error: "url parameter required" });

    try {
      const fetchRes = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; RecipeImporter/1.0; +https://savry.app)",
        },
      });
      if (!fetchRes.ok)
        return res
          .status(422)
          .json({ error: `Could not fetch page (${fetchRes.status})` });

      const html = await fetchRes.text();
      const jsonLd = extractJsonLd(html);

      if (!jsonLd)
        return res.status(422).json({
          error:
            "No structured recipe data found on this page. The site may not support Schema.org markup.",
        });

      const parsed = mapToSchema(jsonLd, url, html);
      const existingCreator = await prisma.creators.findUnique({
        where: { link: parsed.creatorLink },
      });

      return res.status(200).json({
        recipe: parsed,
        creatorExists: !!existingCreator,
        existingCreator: existingCreator ?? null,
      });
    } catch (err) {
      console.error("[import-recipe GET]", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch or parse the URL." });
    }
  }

  // POST — save after user confirms
  if (req.method === "POST") {
    const { recipe }: { recipe: ParsedRecipe } = req.body;
    if (!recipe?.name || !recipe?.link)
      return res.status(400).json({ error: "Invalid recipe data" });

    try {
      await prisma.creators.upsert({
        where: { link: recipe.creatorLink },
        update: {},
        create: {
          link: recipe.creatorLink,
          name: recipe.creatorName,
          image: recipe.creatorImage || "",
          website: recipe.creatorWebsite || "",
          instagram: recipe.creatorInstagram || "",
          youtube: recipe.creatorYoutube || "",
        },
      });

      const existingRecipe = await prisma.recipes.findFirst({
        where: { link: recipe.link },
      });
      if (existingRecipe)
        return res.status(409).json({
          error: "A recipe with this URL already exists in your database.",
        });

      const created = await prisma.recipes.create({
        data: {
          name: recipe.name,
          creatorId: recipe.creatorLink,
          link: recipe.link,
          image: recipe.image || "",
          description: recipe.description,
          category: recipe.category,
          cuisine: recipe.cuisine,
          course: recipe.course,
          method: recipe.method,
          diet: recipe.diet,
        },
      });

      return res.status(200).json({ success: true, recipe: created });
    } catch (err) {
      console.error("[import-recipe POST]", err);
      return res
        .status(500)
        .json({ error: "Database error while saving recipe." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
