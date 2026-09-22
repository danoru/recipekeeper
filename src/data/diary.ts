import prisma from "./db";
import { RECIPE_CARD, USER_SUMMARY } from "./selects";

const DIARY_ENTRY = {
  id: true,
  userId: true,
  recipeId: true,
  rating: true,
  comment: true,
  date: true,
  hasCookedBefore: true,
  recipes: { select: RECIPE_CARD },
  users: { select: USER_SUMMARY },
} as const;

export async function getUserDiaryEntries(userId: number) {
  return prisma.diaryEntries.findMany({
    where: { userId },
    select: DIARY_ENTRY,
    orderBy: { date: "desc" },
  });
}

export async function getDiaryEntriesByUsernames(usernames: string[], take?: number) {
  if (usernames.length === 0) return [];
  return prisma.diaryEntries.findMany({
    where: { users: { username: { in: usernames } } },
    select: DIARY_ENTRY,
    orderBy: { date: "desc" },
    take,
  });
}

/** Just (recipeId, rating) pairs — enough for taste comparisons. */
export async function getUserRatings(userId: number) {
  const entries = await prisma.diaryEntries.findMany({
    where: { userId },
    select: { recipeId: true, rating: true },
  });
  return entries.map((e) => ({ recipeId: e.recipeId, rating: e.rating.toNumber() }));
}

/**
 * Recipes the user rated 4+ but hasn't cooked in `weeks` weeks — highest
 * rated first, then the longest since last cooked.
 */
export async function getCookAgain(userId: number, weeks = 6, take = 4) {
  const cutoff = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

  const groups = await prisma.diaryEntries.groupBy({
    by: ["recipeId"],
    where: { userId },
    _max: { rating: true, date: true },
    having: {
      rating: { _max: { gte: 4 } },
      date: { _max: { lt: cutoff } },
    },
    orderBy: [{ _max: { rating: "desc" } }, { _max: { date: "asc" } }],
    take,
  });
  if (groups.length === 0) return [];

  const recipes = await prisma.recipes.findMany({
    where: { id: { in: groups.map((g) => g.recipeId) } },
    select: RECIPE_CARD,
  });
  const byId = new Map(recipes.map((r) => [r.id, r]));

  return groups.flatMap((g) => {
    const recipe = byId.get(g.recipeId);
    return recipe ? [{ recipe, rating: g._max.rating, lastCooked: g._max.date }] : [];
  });
}

/** Counts for the home sidebar. */
export async function getYearSnapshot(userId: number, username: string) {
  const startOfYear = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));
  const [cookedThisYear, following, followers] = await Promise.all([
    prisma.diaryEntries.count({ where: { userId, date: { gte: startOfYear } } }),
    prisma.following.count({ where: { userId } }),
    prisma.following.count({ where: { followingUsername: username } }),
  ]);
  return { cookedThisYear, following, followers };
}
