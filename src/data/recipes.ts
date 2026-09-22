import type { Prisma } from "@/generated/prisma/client";

import prisma from "./db";
import { creatorSlug, toSlug } from "./helpers";
import { RECIPE_FILTER_KEYS, type RecipeFilterKey, type RecipeFilters } from "./recipeFilters";
import { RECIPE_CARD, USER_SUMMARY } from "./selects";

// ── Queries ───────────────────────────────────────────────────────────────────

/** Lightweight id/name/image list, e.g. for the "log a recipe" picker. */
export async function getRecipeNames() {
  return prisma.recipes.findMany({
    select: { id: true, name: true, image: true },
    orderBy: { name: "asc" },
  });
}

export async function getRecipeCards(filters: RecipeFilters = {}) {
  const where: Prisma.RecipesWhereInput = {
    AND: Object.entries(filters).map(([key, value]) => ({
      [key]: { equals: value, mode: "insensitive" },
    })),
  };

  return prisma.recipes.findMany({
    where,
    select: RECIPE_CARD,
    orderBy: { name: "asc" },
  });
}

/** Recipe cards sorted by average review rating (unreviewed recipes count as 0). */
export async function getRecipeCardsByRating(
  sort: "highest" | "lowest",
  filters: RecipeFilters = {}
) {
  const [recipes, averages] = await Promise.all([
    getRecipeCards(filters),
    prisma.reviews.groupBy({ by: ["recipeId"], _avg: { rating: true } }),
  ]);

  const avgById = new Map(averages.map((a) => [a.recipeId, a._avg.rating?.toNumber() ?? 0]));

  return recipes
    .map((recipe) => ({ ...recipe, averageRating: avgById.get(recipe.id) ?? 0 }))
    .sort((a, b) =>
      sort === "highest" ? b.averageRating - a.averageRating : a.averageRating - b.averageRating
    );
}

/** Distinct values for each filter column, plus the total recipe count. */
export async function getRecipeFilterOptions() {
  const rows = await prisma.recipes.findMany({
    select: { cuisine: true, category: true, course: true, method: true, diet: true },
  });

  const options = Object.fromEntries(
    RECIPE_FILTER_KEYS.map((key) => [
      key,
      [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort(),
    ])
  ) as Record<RecipeFilterKey, string[]>;

  return { options, totalCount: rows.length };
}

/**
 * Resolves `/recipes/[creator]/[recipe]`. The creator segment may be the
 * creator's link or a slug of their name (older URLs used the name).
 */
export async function getRecipeBySlug(creatorSegment: string, recipeSegment: string) {
  const creators = await prisma.creators.findMany({ select: { link: true, name: true } });
  const creator =
    creators.find((c) => c.link === creatorSegment) ??
    creators.find((c) => creatorSlug(c.link) === creatorSegment) ??
    creators.find((c) => creatorSlug(c.name) === creatorSegment);
  if (!creator) return null;

  const candidates = await prisma.recipes.findMany({
    where: { creatorId: creator.link },
    select: { id: true, name: true },
  });
  const match = candidates.find((r) => toSlug(r.name) === recipeSegment);
  if (!match) return null;

  return prisma.recipes.findUnique({
    where: { id: match.id },
    include: {
      creators: true,
      reviews: { select: { rating: true } },
    },
  });
}

/** The signed-in user's relationship to one recipe (for the action bar). */
export async function getRecipeUserState(userId: number, recipeId: number) {
  const [cooklist, diaryEntries, likedRecipes] = await Promise.all([
    prisma.cooklist.findMany({ where: { userId, recipeId } }),
    prisma.diaryEntries.findMany({
      where: { userId, recipeId },
      select: { id: true, userId: true, recipeId: true },
    }),
    prisma.likedRecipes.findMany({ where: { userId, recipeId } }),
  ]);
  return { cooklist, diaryEntries, likedRecipes };
}

/** Reviews of a recipe written by users that `usernames` contains. */
export async function getReviewsByRecipe(recipeId: number, usernames: string[]) {
  if (usernames.length === 0) return [];
  return prisma.reviews.findMany({
    where: { recipeId, users: { username: { in: usernames } } },
    include: { users: { select: USER_SUMMARY } },
  });
}

export async function getRecipesByCreator(creatorId: string) {
  return prisma.recipes.findMany({
    where: { creatorId },
    select: {
      ...RECIPE_CARD,
      diaryEntries: { select: { rating: true } },
    },
    orderBy: { name: "asc" },
  });
}

/** Top 5 recipes most liked by the given users. */
export async function getTopLikedRecipes(usernames: string[]) {
  if (usernames.length === 0) return [];

  const top = await prisma.likedRecipes.groupBy({
    by: ["recipeId"],
    where: { users: { username: { in: usernames } } },
    _count: { recipeId: true },
    orderBy: { _count: { recipeId: "desc" } },
    take: 5,
  });
  const ids = top.map((t) => t.recipeId);

  const recipes = await prisma.recipes.findMany({
    where: { id: { in: ids } },
    select: RECIPE_CARD,
  });
  return recipes.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
}

export async function getCooklist(userId: number) {
  return prisma.cooklist.findMany({
    where: { userId },
    select: { recipes: { select: RECIPE_CARD } },
    orderBy: { recipes: { name: "asc" } },
  });
}
