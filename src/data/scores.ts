import type { Prisma } from "@/generated/prisma/client";
import { average, type Score } from "@/lib/scores";

import prisma from "./db";
import { USER_SUMMARY } from "./selects";

// Diary-based scores (see src/lib/scores.ts for the rules). The database
// averages each user's ratings per recipe, so rows scale with raters, not logs.

async function userAveragesByRecipe(where: Prisma.DiaryEntriesWhereInput = {}) {
  return prisma.diaryEntries.groupBy({
    by: ["recipeId", "userId"],
    where: { ...where, rating: { not: null } },
    _avg: { rating: true },
  });
}

/** recipeId → Score, for the given recipes (or all of them). */
export async function getRecipeScores(recipeIds?: number[]): Promise<Map<number, Score>> {
  const rows = await userAveragesByRecipe(recipeIds ? { recipeId: { in: recipeIds } } : {});
  const perRecipe = new Map<number, number[]>();
  for (const row of rows) {
    const value = row._avg.rating?.toNumber();
    if (value === undefined) continue;
    perRecipe.set(row.recipeId, [...(perRecipe.get(row.recipeId) ?? []), value]);
  }
  return new Map(
    [...perRecipe].map(([id, userScores]) => [
      id,
      { score: average(userScores), count: userScores.length },
    ])
  );
}

/** One recipe's score plus each rater's score (for the distribution chart). */
export async function getRecipeScoreDetail(recipeId: number) {
  const rows = await userAveragesByRecipe({ recipeId });
  const userScores = rows.flatMap((r) => (r._avg.rating ? [r._avg.rating.toNumber()] : []));
  return { score: average(userScores), count: userScores.length, userScores };
}

/** Scores that the given users (e.g. people you follow) gave a recipe. */
export async function getFriendScores(recipeId: number, usernames: string[]) {
  if (usernames.length === 0) return [];
  const rows = await prisma.diaryEntries.groupBy({
    by: ["userId"],
    where: { recipeId, users: { username: { in: usernames } } },
    _avg: { rating: true },
    _count: { _all: true },
  });
  if (rows.length === 0) return [];

  const users = await prisma.users.findMany({
    where: { id: { in: rows.map((r) => r.userId) } },
    select: USER_SUMMARY,
  });
  const byId = new Map(users.map((u) => [u.id, u]));
  return rows.flatMap((r) => {
    const user = byId.get(r.userId);
    return user
      ? [{ user, score: r._avg.rating?.toNumber() ?? null, timesCooked: r._count._all }]
      : [];
  });
}
