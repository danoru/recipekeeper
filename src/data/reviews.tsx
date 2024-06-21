import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserReviews(userId: number) {
  const reviews = await prisma.reviews.findMany({
    where: { userId },
    include: { users: true },
  });
  return reviews;
}

export async function getReviewsByRecipe(recipe: number, usernames: string[]) {
  const reviews = await prisma.reviews.findMany({
    where: {
      recipeId: recipe,
      users: {
        username: {
          in: usernames,
        },
      },
    },
    include: {
      users: true,
    },
  });

  return reviews;
}
