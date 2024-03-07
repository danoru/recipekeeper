export interface RECIPE_LIST_TYPE {
  name: string;
  creator: string;
  link: string;
  image: string;
  description: string;
  category: string;
  cuisine: string;
  course: string;
  method: string;
  diet: string;
  rating: number;
  reviews: number;
}

export interface CREATOR_LIST_TYPE {
  name: string;
  link: string;
  image: string;
  website: string;
  instagram: string;
  youtube: string;
  isFeatured: Boolean;
}
