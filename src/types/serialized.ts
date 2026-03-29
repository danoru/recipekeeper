import type {
  Cooklist,
  Creators,
  DiaryEntries,
  LikedRecipes,
  Recipes,
  Reviews,
  Users,
} from "@prisma/client";

export type SReview = Omit<Reviews, "rating" | "date"> & {
  rating: number;
  date: string;
};

export type SDiaryEntry = Omit<DiaryEntries, "rating" | "date"> & {
  rating: number;
  date: string;
};

export type SRecipe = Omit<Recipes, "createdAt"> & {
  reviews?: SReview[];
  creators?: Creators;
};

export type SUser = Omit<Users, "joinDate"> & {
  joinDate: string;
};

// Relation-joined variants used on specific pages
export type SReviewWithUser = SReview & { users: SUser };
export type SDiaryEntryWithRecipe = SDiaryEntry & { recipes: Recipes };
export type SDiaryEntryComplete = SDiaryEntry & {
  recipes: Recipes & { creators: Creators };
  users: SUser;
};
export type SCooklistWithRecipe = Cooklist & { recipes: Recipes };
