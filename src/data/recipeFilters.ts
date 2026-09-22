// Shared by the server queries and the /recipes page UI — must stay free of Prisma imports.
export const RECIPE_FILTER_KEYS = ["cuisine", "category", "course", "method", "diet"] as const;
export type RecipeFilterKey = (typeof RECIPE_FILTER_KEYS)[number];
export type RecipeFilters = Partial<Record<RecipeFilterKey, string>>;
