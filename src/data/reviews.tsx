import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserReviews(userId: number) {
  const reviews = await prisma.reviews.findMany({
    where: { userId },
    include: { users: true },
  });
  return reviews;
}
