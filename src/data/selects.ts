import type { Prisma } from "@/generated/prisma/client";

// Never select `password` or `email` for anything that can reach page props.
export const PUBLIC_USER = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  location: true,
  website: true,
  bio: true,
  image: true,
  badge: true,
  joinDate: true,
} satisfies Prisma.UsersSelect;

export const USER_SUMMARY = {
  id: true,
  username: true,
  image: true,
} satisfies Prisma.UsersSelect;

export const CREATOR_SUMMARY = {
  link: true,
  name: true,
  image: true,
} satisfies Prisma.CreatorsSelect;

// Enough to render a recipe card and link to it.
export const RECIPE_CARD = {
  id: true,
  name: true,
  image: true,
  creatorId: true,
  creators: { select: CREATOR_SUMMARY },
} satisfies Prisma.RecipesSelect;
