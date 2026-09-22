import type { Prisma } from "@/generated/prisma/client";
import type { ImportedRecipe, ImportedStep } from "@/lib/import/jsonld";
import { canonicalizeUrl } from "@/lib/import/url";
import { IngredientMatcher, type DictionaryEntry } from "@/lib/ingredients/match";
import { buildIngredientRows } from "@/lib/ingredients/rows";

import prisma from "./db";

// ── Ingredient dictionary ─────────────────────────────────────────────────────

let cached: { matcher: IngredientMatcher<DictionaryEntry>; at: number } | null = null;
const TTL_MS = 10 * 60 * 1000;

/** Matcher over the `Ingredient` table, cached per server instance. */
export async function getIngredientMatcher() {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.matcher;
  const entries = await prisma.ingredient.findMany({
    select: { id: true, name: true, aliases: true },
  });
  cached = { matcher: new IngredientMatcher(entries), at: Date.now() };
  return cached.matcher;
}

// ── Writing recipe content ────────────────────────────────────────────────────

async function contentData(ingredients: string[], steps: ImportedStep[]) {
  const matcher = await getIngredientMatcher();
  return {
    ingredients: buildIngredientRows(ingredients, matcher),
    steps: steps.map((step, position) => ({ position, section: step.section, text: step.text })),
  };
}

/** Finds an existing recipe for this URL, ignoring tracking params etc. */
export async function findRecipeByUrl(url: string) {
  const canonical = canonicalizeUrl(url);
  return prisma.recipes.findFirst({
    where: {
      OR: [{ link: url }, ...(canonical ? [{ sourceUrlCanonical: canonical }] : [])],
    },
    select: { id: true, name: true, creatorId: true },
  });
}

/** Creates a recipe (and its creator, if new) with parsed ingredients and steps. */
export async function createImportedRecipe(recipe: ImportedRecipe) {
  const { ingredients, steps } = await contentData(recipe.ingredients, recipe.steps);

  return prisma.recipes.create({
    data: {
      name: recipe.name,
      link: recipe.link,
      sourceUrlCanonical: canonicalizeUrl(recipe.link),
      image: recipe.image || "",
      description: recipe.description,
      category: recipe.category,
      cuisine: recipe.cuisine,
      course: recipe.course,
      method: recipe.method,
      diet: recipe.diet,
      recipeYield: recipe.recipeYield,
      totalTimeMinutes: recipe.totalTimeMinutes,
      creators: {
        connectOrCreate: {
          where: { link: recipe.creatorLink },
          create: {
            link: recipe.creatorLink,
            name: recipe.creatorName,
            image: recipe.creatorImage || "",
            website: recipe.creatorWebsite || "",
            instagram: recipe.creatorInstagram || "",
            youtube: recipe.creatorYoutube || "",
          },
        },
      },
      ingredients: { create: ingredients },
      steps: { create: steps },
    },
    select: { id: true, name: true, creatorId: true },
  });
}

/**
 * Replaces an existing recipe's ingredients/steps and fills in missing
 * metadata (used by the backfill script). Never overwrites curated fields.
 */
export async function replaceRecipeContent(
  recipeId: number,
  recipe: Pick<
    ImportedRecipe,
    "ingredients" | "steps" | "recipeYield" | "totalTimeMinutes" | "link"
  >
) {
  const { ingredients, steps } = await contentData(recipe.ingredients, recipe.steps);

  // Older catalogs can contain duplicate recipes; only the first to claim a
  // canonical URL gets it, so the unique constraint never fails the update.
  const canonical = canonicalizeUrl(recipe.link);
  const claimed = canonical
    ? await prisma.recipes.findFirst({
        where: { sourceUrlCanonical: canonical, id: { not: recipeId } },
        select: { id: true },
      })
    : null;

  const data: Prisma.RecipesUpdateInput = {
    ...(canonical && !claimed ? { sourceUrlCanonical: canonical } : {}),
    recipeYield: recipe.recipeYield,
    totalTimeMinutes: recipe.totalTimeMinutes,
    ingredients: { deleteMany: {}, create: ingredients },
    steps: { deleteMany: {}, create: steps },
  };
  return prisma.recipes.update({ where: { id: recipeId }, data, select: { id: true } });
}

/** Parsed ingredient names that didn't match the dictionary, most common first. */
export async function getUnmatchedIngredients(take = 100) {
  const rows = await prisma.recipeIngredient.groupBy({
    by: ["name"],
    where: { ingredientId: null, name: { not: null } },
    _count: { name: true },
    orderBy: { _count: { name: "desc" } },
    take,
  });
  return rows.map((r) => ({ name: r.name!, count: r._count.name }));
}
