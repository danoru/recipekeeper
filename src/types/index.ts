export interface CREATOR_LIST_TYPE {
  name: string;
  link: string;
  image: string;
  website: string;
  instagram?: string;
  youtube?: string;
}
export interface RECIPE_LIST_TYPE {
  name: string;
  creatorId: string;
  link: string;
  image: string;
  description: string;
  category: string;
  cuisine: string;
  course: string;
  method: string;
  diet: string;
}

export interface USER_LIST_TYPE {
  username: string;
  profile: UserProfile;
  cooklist?: string[];
  diary?: UserDiary[];
  favorites?: UserFavorites;
  liked?: UserLikes;
  followers?: string[];
  following?: string[];
}

interface UserProfile {
  name: string;
  email?: string;
  image?: string;
  bio?: string;
  location?: string;
  badge?: string;
  joinDate: string;
}

interface UserFavorites {
  recipes: string[];
  creators: string[];
}

interface UserLikes {
  recipes: string[];
  creators: string[];
}

export interface UserDiary {
  recipe: string;
  rating?: number;
  comment?: string;
  date: string;
  hasCookedBefore: boolean;
  username?: string;
}

export interface User {
  id: string;
  username: string;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
