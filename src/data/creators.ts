import prisma from "./db";

export async function getAllCreators() {
  return prisma.creators.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCreatorByLink(creatorLink: string) {
  return prisma.creators.findUnique({
    where: { link: creatorLink },
  });
}

/** Top 5 creators most liked by the given users. */
export async function getTopLikedCreators(usernames: string[]) {
  if (usernames.length === 0) return [];

  const top = await prisma.likedCreators.groupBy({
    by: ["creatorId"],
    where: { users: { username: { in: usernames } } },
    _count: { creatorId: true },
    orderBy: { _count: { creatorId: "desc" } },
    take: 5,
  });
  const ids = top.map((t) => t.creatorId);

  const creators = await prisma.creators.findMany({ where: { link: { in: ids } } });
  return creators.sort((a, b) => ids.indexOf(a.link) - ids.indexOf(b.link));
}
