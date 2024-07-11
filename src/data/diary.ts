import prisma from "./db";

export async function getUserDiaryEntries(userId: number) {
  const diaryEntries = await prisma.diaryEntries.findMany({
    where: { userId },
    include: { users: true, recipes: true },
    orderBy: { date: "desc" },
  });

  return diaryEntries;
}

export async function getDiaryEntriesByUsernames(usernames: string[]) {
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
    orderBy: { date: "desc" },
  });

  return entries;
}
