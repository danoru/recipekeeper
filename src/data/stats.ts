import type { Prisma } from "@/generated/prisma/client";
import { busiestMonth, longestStreak, topBy } from "@/lib/stats";

import prisma from "./db";
import { CREATOR_SUMMARY, PUBLIC_USER, USER_SUMMARY } from "./selects";

type UserSummary = Prisma.UsersGetPayload<{ select: typeof USER_SUMMARY }>;

const WRAPPED_RECIPE = {
  id: true,
  name: true,
  image: true,
  creatorId: true,
  cuisine: true,
  creators: { select: CREATOR_SUMMARY },
} as const;

/** A user's year in the kitchen, or null if the user doesn't exist. */
export async function getYearInReview(username: string, year: number) {
  const user = await prisma.users.findUnique({ where: { username }, select: PUBLIC_USER });
  if (!user) return null;

  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const [entries, following] = await Promise.all([
    prisma.diaryEntries.findMany({
      where: { userId: user.id, date: { gte: start, lt: end } },
      select: { date: true, rating: true, recipes: { select: WRAPPED_RECIPE } },
      orderBy: { date: "asc" },
    }),
    prisma.following.findMany({
      where: { userId: user.id },
      select: { followingUsername: true },
    }),
  ]);

  const cooked = entries.flatMap((e) =>
    e.recipes ? [{ date: e.date, rating: e.rating?.toNumber() ?? null, recipe: e.recipes }] : []
  );
  const recipesById = new Map(cooked.map((c) => [c.recipe.id, c.recipe]));

  // Friends (people this user follows) who cooked the same recipes this year.
  const friendEntries =
    following.length > 0 && recipesById.size > 0
      ? await prisma.diaryEntries.findMany({
          where: {
            recipeId: { in: [...recipesById.keys()] },
            date: { gte: start, lt: end },
            users: { username: { in: following.map((f) => f.followingUsername) } },
          },
          select: { recipeId: true, users: { select: USER_SUMMARY } },
        })
      : [];
  const sharedByFriend = new Map<string, { user: UserSummary; recipes: Set<number> }>();
  for (const e of friendEntries) {
    if (!e.users) continue;
    const slot = sharedByFriend.get(e.users.username) ?? { user: e.users, recipes: new Set() };
    slot.recipes.add(e.recipeId);
    sharedByFriend.set(e.users.username, slot);
  }
  const cookedWith = [...sharedByFriend.values()]
    .map((s) => ({ user: s.user, sharedRecipes: s.recipes.size }))
    .sort(
      (a, b) => b.sharedRecipes - a.sharedRecipes || a.user.username.localeCompare(b.user.username)
    )
    .slice(0, 3);

  const byRecipe = topBy(cooked, (c) => String(c.recipe.id), 1)[0];
  const mostCooked = byRecipe
    ? { recipe: recipesById.get(Number(byRecipe.key))!, times: byRecipe.count }
    : null;

  // Highest rated: best rating, most recent wins ties. Meals logged without a rating are skipped.
  const ratedMeals = cooked.flatMap((c) => (c.rating === null ? [] : [{ ...c, rating: c.rating }]));
  const highestRated =
    ratedMeals.length > 0
      ? ratedMeals.reduce((best, c) => (c.rating >= best.rating ? c : best))
      : null;

  const creatorNames = new Map(cooked.map((c) => [c.recipe.creatorId, c.recipe.creators]));
  const topCreators = topBy(cooked, (c) => c.recipe.creatorId, 3).map((t) => ({
    creator: creatorNames.get(t.key)!,
    count: t.count,
  }));

  const ratings = ratedMeals.map((c) => c.rating);

  return {
    user,
    year,
    totalMeals: cooked.length,
    distinctRecipes: recipesById.size,
    averageRating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
    topCreators,
    topCuisines: topBy(
      cooked,
      (c) => (c.recipe.cuisine && c.recipe.cuisine !== "Unknown" ? c.recipe.cuisine : null),
      3
    ),
    mostCooked,
    highestRated: highestRated
      ? { recipe: highestRated.recipe, rating: highestRated.rating }
      : null,
    busiestMonth: busiestMonth(cooked),
    longestStreak: longestStreak(cooked),
    cookedWith,
  };
}

export type YearInReview = NonNullable<Awaited<ReturnType<typeof getYearInReview>>>;
