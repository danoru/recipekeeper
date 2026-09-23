import prisma from "./db";
import { RECIPE_CARD } from "./selects";

/**
 * A user's reviews: their diary entries that include notes, newest first.
 * (The legacy Reviews table is no longer written to or read.)
 */
export async function getUserReviews(userId: number) {
  return prisma.diaryEntries.findMany({
    where: { userId, comment: { not: null } },
    select: {
      id: true,
      rating: true,
      date: true,
      comment: true,
      recipes: { select: RECIPE_CARD },
    },
    orderBy: { date: "desc" },
  });
}
