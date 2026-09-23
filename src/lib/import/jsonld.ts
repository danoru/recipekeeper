import { guessCategory, guessCourse, guessCuisine, guessDiet, guessMethod } from "./taxonomy";

// Parses schema.org Recipe JSON-LD into Savry's import shape. Shared by the
// server-side URL fetch and the bookmarklet (which sends JSON-LD from the
// user's browser, for sites that block server fetches).

export interface ImportedStep {
  section: string | null;
  text: string;
}

export interface ImportedRecipe {
  name: string;
  description: string;
  image: string;
  category: string;
  cuisine: string;
  course: string;
  method: string;
  diet: string;
  link: string;
  recipeYield: string | null;
  totalTimeMinutes: number | null;
  ingredients: string[];
  steps: ImportedStep[];
  creatorName: string;
  creatorLink: string;
  creatorWebsite: string;
  creatorImage: string;
  creatorInstagram: string;
  creatorYoutube: string;
}

/** What we need from a page; the bookmarklet sends exactly this. */
export interface PageData {
  url: string;
  jsonLd: string[];
  ogSiteName?: string | null;
  ogImage?: string | null;
}

type Json = Record<string, unknown>;

// ── Text helpers ──────────────────────────────────────────────────────────────

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  frac12: "½",
  frac14: "¼",
  frac34: "¾",
  deg: "°",
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

/** Strips tags, decodes entities, and collapses whitespace. */
export function cleanText(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return decodeEntities(String(value).replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function firstString(value: unknown): string {
  if (Array.isArray(value)) return firstString(value[0]);
  if (value && typeof value === "object") {
    const obj = value as Json;
    // Never fall back to "@id": it's a reference URI, not a display value.
    return firstString(obj.name ?? obj.url);
  }
  return cleanText(value);
}

function allStrings(value: unknown): string {
  return (Array.isArray(value) ? value : [value]).map(firstString).filter(Boolean).join(", ");
}

/** ISO-8601 duration ("PT1H30M", "P0DT45M") → minutes. */
export function parseDuration(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const m = value.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:\d+S)?)?$/i);
  if (!m) return null;
  const minutes = Number(m[1] ?? 0) * 1440 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  return minutes > 0 ? minutes : null;
}

// ── JSON-LD discovery ─────────────────────────────────────────────────────────

function isRecipe(node: unknown): node is Json {
  if (!node || typeof node !== "object") return false;
  const type = (node as Json)["@type"];
  return (Array.isArray(type) ? type : [type]).some((t) => t === "Recipe");
}

/** Depth-first search through arrays, @graph, and mainEntity for a Recipe. */
function findRecipe(node: unknown, depth = 0): Json | null {
  if (!node || typeof node !== "object" || depth > 6) return null;
  if (isRecipe(node)) return node;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findRecipe(child, depth + 1);
      if (found) return found;
    }
    return null;
  }
  const obj = node as Json;
  return findRecipe(obj["@graph"], depth + 1) ?? findRecipe(obj.mainEntity, depth + 1);
}

/** Records every node that has an "@id", so references can be resolved. */
function indexNodes(node: unknown, index: Map<string, Json>, depth = 0) {
  if (!node || typeof node !== "object" || depth > 6) return;
  if (Array.isArray(node)) {
    for (const child of node) indexNodes(child, index, depth + 1);
    return;
  }
  const obj = node as Json;
  if (typeof obj["@id"] === "string" && Object.keys(obj).length > 1) index.set(obj["@id"], obj);
  indexNodes(obj["@graph"], index, depth + 1);
}

/** `{ "@id": "…" }` → the full node it points to (or the value unchanged). */
function resolveRef(value: unknown, index: Map<string, Json>): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const obj = value as Json;
  const id = obj["@id"];
  if (typeof id === "string" && !obj.name && index.has(id)) return index.get(id);
  return value;
}

/** Pulls JSON-LD blocks and Open Graph fallbacks out of raw HTML. */
export function extractPageData(html: string, url: string): PageData {
  const jsonLd: string[] = [];
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) jsonLd.push(match[1]);

  const meta = (property: string) =>
    html.match(
      new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")
    )?.[1] ??
    html.match(
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i")
    )?.[1] ??
    null;

  return { url, jsonLd, ogSiteName: meta("og:site_name"), ogImage: meta("og:image") };
}

// ── Field mapping ─────────────────────────────────────────────────────────────

function extractImage(image: unknown): string {
  if (Array.isArray(image)) return extractImage(image[0]);
  if (image && typeof image === "object") return cleanText((image as Json).url);
  return cleanText(image);
}

function extractIngredients(value: unknown): string[] {
  const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(/\n+/) : [];
  return list.map(cleanText).filter(Boolean).slice(0, 100);
}

/** Flattens string | HowToStep | HowToSection (and arrays of them) into steps. */
export function extractSteps(value: unknown, section: string | null = null): ImportedStep[] {
  if (typeof value === "string") {
    return value
      .split(/\n+|<br\s*\/?>|<\/p>/i)
      .map(cleanText)
      .filter(Boolean)
      .map((text) => ({ section, text }));
  }
  if (Array.isArray(value)) return value.flatMap((v) => extractSteps(v, section));
  if (value && typeof value === "object") {
    const obj = value as Json;
    const type = Array.isArray(obj["@type"]) ? obj["@type"] : [obj["@type"]];
    if (type.includes("HowToSection")) {
      return extractSteps(obj.itemListElement, cleanText(obj.name) || section);
    }
    const text = cleanText(obj.text ?? obj.name);
    if (text) return [{ section, text }];
    if (obj.itemListElement) return extractSteps(obj.itemListElement, section);
  }
  return [];
}

function creatorSlugFromUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname
      .replace(/^www\./, "")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase();
  } catch {
    return url
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 40);
  }
}

function orUnknown(value: string): string {
  return value.trim() || "Unknown";
}

/** An empty recipe for manual entry, with the creator guessed from the URL's site. */
export function blankRecipe(url: string): ImportedRecipe {
  let website = "";
  try {
    website = new URL(url).origin;
  } catch {
    // leave blank; the form still requires a valid link to save
  }
  const creatorLink = creatorSlugFromUrl(website || url);
  return {
    name: "",
    description: "",
    image: "",
    category: "Other",
    cuisine: "Unknown",
    course: "Mains",
    method: "Classic",
    diet: "None",
    link: url,
    recipeYield: null,
    totalTimeMinutes: null,
    ingredients: [],
    steps: [],
    creatorName: creatorLink,
    creatorLink,
    creatorWebsite: website,
    creatorImage: "",
    creatorInstagram: "",
    creatorYoutube: "",
  };
}

/** The page's Recipe mapped to Savry's shape, or null if it has none. */
export function parseRecipe(page: PageData): ImportedRecipe | null {
  let recipe: Json | null = null;
  const nodesById = new Map<string, Json>();
  for (const block of page.jsonLd) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(block.trim());
    } catch {
      continue; // malformed JSON-LD is common; try the next block
    }
    indexNodes(parsed, nodesById);
    recipe ??= findRecipe(parsed);
  }
  if (!recipe) return null;

  // Yoast-style graphs reference the author by "@id" instead of inlining it.
  const authorRef = Array.isArray(recipe.author) ? recipe.author[0] : recipe.author;
  const author = resolveRef(authorRef, nodesById);
  const authorName = firstString(author);
  const authorUrl = author && typeof author === "object" ? cleanText((author as Json).url) : "";

  let creatorWebsite = authorUrl;
  if (!creatorWebsite) {
    try {
      creatorWebsite = new URL(page.url).origin;
    } catch {
      creatorWebsite = page.url;
    }
  }
  const creatorLink = creatorSlugFromUrl(creatorWebsite || page.url);
  const ogSiteName = cleanText(page.ogSiteName);

  const name = firstString(recipe.name);
  const recipeCategory = allStrings(recipe.recipeCategory);
  const keywords = allStrings(recipe.keywords);

  return {
    name: orUnknown(name),
    description: orUnknown(firstString(recipe.description)),
    image: extractImage(recipe.image) || cleanText(page.ogImage),
    category: guessCategory(name, `${recipeCategory} ${keywords}`),
    cuisine: guessCuisine(allStrings(recipe.recipeCuisine)) ?? "Unknown",
    course: guessCourse(recipeCategory, name),
    method: guessMethod(`${name} ${keywords} ${allStrings(recipe.cookingMethod)}`),
    diet: guessDiet(allStrings(recipe.suitableForDiet)),
    link: page.url,
    recipeYield: firstString(recipe.recipeYield) || null,
    totalTimeMinutes:
      parseDuration(recipe.totalTime) ??
      ((parseDuration(recipe.prepTime) ?? 0) + (parseDuration(recipe.cookTime) ?? 0) || null),
    ingredients: extractIngredients(recipe.recipeIngredient ?? recipe.ingredients),
    steps: extractSteps(recipe.recipeInstructions).slice(0, 100),
    creatorName: orUnknown(authorName || ogSiteName || creatorLink),
    creatorLink,
    creatorWebsite,
    creatorImage: "",
    creatorInstagram: "",
    creatorYoutube: "",
  };
}
