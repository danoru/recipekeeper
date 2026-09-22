import prisma from "./db";
import { RECIPE_CARD, USER_SUMMARY } from "./selects";

export async function getUserReviews(userId: number) {
  return prisma.reviews.findMany({
    where: { userId },
    include: {
      recipes: { select: RECIPE_CARD },
      users: { select: USER_SUMMARY },
    },
    orderBy: { date: "desc" },
  });
}
