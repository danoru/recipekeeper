import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserDiaryEntries(userId: number) {
  const diaryEntries = await prisma.diaryEntries.findMany({
    where: { userId },
  });

  return diaryEntries;
}

export async function getFollowingDiaryEntries(userId: number) {
  const followingList = await prisma.following.findMany({
    where: {
      userId,
    },
    select: {
      followingUsername: true,
    },
  });

  const usernames = followingList.map((f) => f.followingUsername);

  const entries = await prisma.diaryEntries.findMany({
    where: {
      users: {
        username: {
          in: usernames,
        },
      },
    },
    include: {
      recipes: true,
      users: true,
    },
  });

  return entries;
}

export async function getRecentDiaryEntries(userId: number) {
  const followingList = await prisma.following.findMany({
    where: { userId },
    select: {
      followingUsername: true,
    },
  });

  const usernames = followingList.map((f) => f.followingUsername);

  const entries = await prisma.diaryEntries.findMany({
    where: {
      users: {
        username: {
          in: usernames,
        },
      },
    },
    include: {
      recipes: true,
      users: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });
  return entries;
}
