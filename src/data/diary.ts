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
