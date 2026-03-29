import { NextRequest, NextResponse } from "next/server";
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

/** Derive a slug-style key from a URL, used as Creators.link */
function creatorSlugFromUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "").replace(/\.[^.]+$/, ""); // e.g. "budgetbytes"
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

// ─── JSON-LD Extraction ───────────────────────────────────────────────────────

function extractJsonLd(html: string): JsonLdRecipe | null {
  const scriptRegex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const raw = JSON.parse(match[1]);

      // Handle @graph arrays (e.g. Yoast SEO)
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

// ─── Open Graph fallback image ────────────────────────────────────────────────

function extractOgImage(html: string): string {
  const match = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  return match?.[1] ?? "";
}

// ─── Main mapper ─────────────────────────────────────────────────────────────

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

  // Derive creator website — prefer explicit author URL, else page origin
  let creatorWebsite = authorUrl;
  if (!creatorWebsite) {
    try {
      creatorWebsite = new URL(pageUrl).origin;
    } catch {
      creatorWebsite = pageUrl;
    }
  }

  const creatorLink = creatorSlugFromUrl(creatorWebsite || pageUrl);

  // Try to get the site name from og:site_name for a nicer creator name
  const ogSiteName =
    html.match(
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ?? "";

  const creatorName = authorName || ogSiteName || creatorLink;

  const image = extractImage(recipe.image) || extractOgImage(html);

  // Diet: strip Schema.org prefix if present
  const rawDiet = firstString(recipe.suitableForDiet);
  const diet = rawDiet.replace(/https?:\/\/schema\.org\//i, "") || "None";

  return {
    name: normalise(firstString(recipe.name)),
    description: normalise(firstString(recipe.description)),
    image,
    category: normalise(firstString(recipe.recipeCategory)),
    cuisine: normalise(firstString(recipe.recipeCuisine)),
    course: normalise(firstString(recipe.recipeYield) ? "Main" : "Unknown"), // yield ≠ course; default sensibly
    method: normalise(firstString(recipe.cookingMethod)),
    diet: normalise(diet),
    link: pageUrl,
    creatorName: normalise(creatorName),
    creatorLink,
    creatorWebsite,
    creatorImage: "", // can't reliably scrape; user can fill in
    creatorInstagram: "",
    creatorYoutube: "",
  };
}

// ─── Route handlers ───────────────────────────────────────────────────────────

/** GET /api/import-recipe?url=... — preview without saving */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: "url parameter required" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RecipeImporter/1.0; +https://savry.app)",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch page (${res.status})` },
        { status: 422 },
      );
    }

    const html = await res.text();
    const jsonLd = extractJsonLd(html);

    if (!jsonLd) {
      return NextResponse.json(
        {
          error:
            "No structured recipe data found on this page. The site may not support Schema.org markup.",
        },
        { status: 422 },
      );
    }

    const parsed = mapToSchema(jsonLd, url, html);

    // Check if creator already exists
    const existingCreator = await prisma.creators.findUnique({
      where: { link: parsed.creatorLink },
    });

    return NextResponse.json({
      recipe: parsed,
      creatorExists: !!existingCreator,
      existingCreator: existingCreator ?? null,
    });
  } catch (err) {
    console.error("[import-recipe GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch or parse the URL." },
      { status: 500 },
    );
  }
}

/** POST /api/import-recipe — save after user confirms */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recipe }: { recipe: ParsedRecipe } = body;

  if (!recipe?.name || !recipe?.link) {
    return NextResponse.json({ error: "Invalid recipe data" }, { status: 400 });
  }

  try {
    // Upsert creator — if they exist, leave their data alone; if not, create with what we have
    await prisma.creators.upsert({
      where: { link: recipe.creatorLink },
      update: {}, // don't overwrite existing creator data
      create: {
        link: recipe.creatorLink,
        name: recipe.creatorName,
        image: recipe.creatorImage || "",
        website: recipe.creatorWebsite || "",
        instagram: recipe.creatorInstagram || "",
        youtube: recipe.creatorYoutube || "",
      },
    });

    // Check if recipe with this link already exists
    const existingRecipe = await prisma.recipes.findFirst({
      where: { link: recipe.link },
    });

    if (existingRecipe) {
      return NextResponse.json(
        { error: "A recipe with this URL already exists in your database." },
        { status: 409 },
      );
    }

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

    return NextResponse.json({ success: true, recipe: created });
  } catch (err) {
    console.error("[recipe-import POST]", err);
    return NextResponse.json(
      { error: "Database error while saving recipe." },
      { status: 500 },
    );
  }
}
