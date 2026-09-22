import type { ImportedRecipe, ImportedStep, PageData } from "./jsonld";
import { parseHttpUrl } from "./url";

// Import payloads come from the browser (the preview form or the bookmarklet),
// so every field is coerced and length-limited before it reaches the database.

function str(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function strList(value: unknown, maxItems: number, maxLen: number): string[] {
  return Array.isArray(value)
    ? value
        .map((v) => str(v, maxLen))
        .filter(Boolean)
        .slice(0, maxItems)
    : [];
}

function httpUrlOrEmpty(value: unknown): string {
  return parseHttpUrl(value)?.toString() ?? "";
}

export function sanitizeImportedRecipe(input: unknown): ImportedRecipe | null {
  if (!input || typeof input !== "object") return null;
  const r = input as Record<string, unknown>;

  const link = httpUrlOrEmpty(r.link);
  const name = str(r.name, 300);
  const creatorLink = str(r.creatorLink, 100)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!link || !name || !creatorLink) return null;

  const steps: ImportedStep[] = Array.isArray(r.steps)
    ? r.steps
        .map((s) => {
          const step = (s ?? {}) as Record<string, unknown>;
          return { section: str(step.section, 200) || null, text: str(step.text, 4000) };
        })
        .filter((s) => s.text)
        .slice(0, 100)
    : [];

  const minutes = Number(r.totalTimeMinutes);

  return {
    name,
    description: str(r.description, 5000) || "Unknown",
    image: httpUrlOrEmpty(r.image),
    category: str(r.category, 100) || "Other",
    cuisine: str(r.cuisine, 100) || "Unknown",
    course: str(r.course, 100) || "Mains",
    method: str(r.method, 100) || "Classic",
    diet: str(r.diet, 100) || "None",
    link,
    recipeYield: str(r.recipeYield, 100) || null,
    totalTimeMinutes:
      Number.isInteger(minutes) && minutes > 0 && minutes < 100_000 ? minutes : null,
    ingredients: strList(r.ingredients, 100, 500),
    steps,
    creatorName: str(r.creatorName, 200) || creatorLink,
    creatorLink,
    creatorWebsite: httpUrlOrEmpty(r.creatorWebsite),
    creatorImage: httpUrlOrEmpty(r.creatorImage),
    creatorInstagram: httpUrlOrEmpty(r.creatorInstagram),
    creatorYoutube: httpUrlOrEmpty(r.creatorYoutube),
  };
}

/** Bookmarklet payload: the page URL plus its JSON-LD and Open Graph tags. */
export function sanitizePageData(input: unknown): PageData | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Record<string, unknown>;
  const url = parseHttpUrl(p.url)?.toString();
  const jsonLd = strList(p.jsonLd, 20, 500_000);
  if (!url || jsonLd.length === 0) return null;
  return {
    url,
    jsonLd,
    ogSiteName: str(p.ogSiteName, 200) || null,
    ogImage: httpUrlOrEmpty(p.ogImage) || null,
  };
}
