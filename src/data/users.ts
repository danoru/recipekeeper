import prisma from "./db";
import { CREATOR_SUMMARY, PUBLIC_USER, RECIPE_CARD, USER_SUMMARY } from "./selects";

export async function getAllUsers() {
  return prisma.users.findMany({
    select: PUBLIC_USER,
    orderBy: { username: "asc" },
  });
}

export async function findUserByUsername(username: string) {
  return prisma.users.findUnique({
    where: { username },
    select: PUBLIC_USER,
  });
}

/** Includes `email`; only for the signed-in user's own settings. */
export async function getOwnSettings(userId: number) {
  return prisma.users.findUnique({
    where: { id: userId },
    select: { ...PUBLIC_USER, email: true },
  });
}

export async function getUserProfile(username: string) {
  return prisma.users.findUnique({
    where: { username },
    select: {
      ...PUBLIC_USER,
      cooklist: { select: { recipes: { select: RECIPE_CARD } } },
      diaryEntries: {
        select: {
          id: true,
          userId: true,
          rating: true,
          date: true,
          recipes: { select: RECIPE_CARD },
        },
        orderBy: { date: "desc" },
      },
      favoritesCreators: { select: { creators: { select: CREATOR_SUMMARY } } },
      favoritesRecipes: { select: { recipes: { select: RECIPE_CARD } } },
      following: true,
      reviews: { select: { rating: true } },
    },
  });
}

export async function getFollowers(username: string) {
  return prisma.following.findMany({
    where: { followingUsername: username },
    include: { users: { select: USER_SUMMARY } },
  });
}

export async function getFollowing(userId: number) {
  return prisma.following.findMany({
    where: { userId },
  });
}

export async function getFollowingList(userId: number) {
  const following = await prisma.following.findMany({
    where: { userId },
    select: { followingUsername: true },
  });
  return following.map((f) => f.followingUsername);
}

export async function getUserLikes(username: string) {
  return prisma.users.findUnique({
    where: { username },
    select: {
      ...PUBLIC_USER,
      likedCreators: { select: { creators: true } },
      likedRecipes: {
        select: { recipes: { select: RECIPE_CARD } },
        orderBy: { recipes: { name: "asc" } },
      },
    },
  });
}
