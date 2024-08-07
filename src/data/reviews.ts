import prisma from "./db";

export async function getUserReviews(userId: number) {
  const reviews = await prisma.reviews.findMany({
    where: { userId },
    include: { recipes: true, users: true },
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
