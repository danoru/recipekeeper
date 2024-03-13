import { RECIPE_LIST_TYPE } from "../types";

// "DATA FORMAT"
// {
//   name: "",
//   creator: "",
//   creatorId: "",
//   link: "",
//   image: "",
//   description: "",
//   category: "",
//   cuisine: "",
//   course: "",
//   method: "",
//   diet: "",
//   rating: ,
//   reviews: ,
// }

export const RECIPE_LIST: RECIPE_LIST_TYPE[] = [
  {
    name: "Butternut Squash and Pork Lasagna",
    creator: "Frankie Gaw of Little Fat Boy",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/butternut-squash-and-pork-lasagna",
    image:
      "https://littlefatboy.com/media/pages/recipes/butternut-squash-and-pork-lasagna/8a9dafe748-1698875724/lasagna_hero.gif",
    description:
      "Traditional lasagna gets a fall makeover with a tomato butternut squash and pork sauce layered with ricotta mozarella and scallion.",
    category: "Pasta",
    cuisine: "Asian",
    course: "Main",
    method: "",
    diet: "",
    rating: 4,
    reviews: 1,
  },
  {
    name: "Taiwanese American Chicken Pot Pie",
    creator: "Frankie Gaw of Little Fat Boy",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/taiwanese-american-chicken-pot-pie",
    image:
      "https://littlefatboy.com/media/pages/recipes/taiwanese-american-chicken-pot-pie/01cc49ae12-1655261071/taiwanese_chicken_pot_pie.png",
    description:
      "A classic chicken pot pie with a filling made from onion, chicken thigh, potato, and carrots — but seasoned with classic Taiwanese grandma flavors like scallions, ginger, rice wine, and soy sauce.",
    category: "Chicken",
    cuisine: "Asian",
    course: "Main",
    method: "",
    diet: "",
    rating: 5,
    reviews: 1,
  },
  {
    name: "Banana Walnut Mochi Bread",
    creator: "Frankie Gaw of Little Fat Boy",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/banana-walnut-mochi-bread",
    image:
      "https://littlefatboy.com/media/pages/recipes/banana-walnut-mochi-bread/0a7ccdd835-1652838619/bananawalnutbread_3-27-22.png",
    description:
      "A tribute to classic banana bread with a chewy (and gluten-free!) twist. Rice flour steps in for a guest appearance to create new texture within this sweet and nutty bread.",
    category: "Other",
    cuisine: "Asian",
    course: "Dessert",
    method: "",
    diet: "Gluten-free",
    rating: 4,
    reviews: 1,
  },
  {
    name: "Chicken Pozole Verde",
    creator: "Isabel Orozco-Moore of Isabel Eats",
    creatorId: "isabeleats",
    link: "https://www.isabeleats.com/chicken-pozole-verde/",
    image:
      "https://www.isabeleats.com/wp-content/uploads/2022/10/pozole-verde-small-8.jpg",
    description:
      "Pozole Verde is a comforting Mexican stew filled with shredded chicken and hominy in a delicious green chile broth made from tomatillos, jalapeños, and cilantro. It’s easy to make, hearty, and ready in only one hour!",
    category: "Soup",
    cuisine: "North American",
    course: "Main",
    method: "",
    diet: "",
    rating: 5,
    reviews: 1,
  },
  {
    name: "Zuppa Tuscana Congee",
    creator: "Frankie Gaw of Little Fat Boy",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/zuppa-toscana-congee",
    image:
      "https://littlefatboy.com/media/pages/recipes/zuppa-toscana-congee/065608820d-1655350789/zuppa_toscana_congee_pink_6-15-22.png",
    description:
      "Simple congee serves as the perfect base for the flavors of the iconic Zuppa Toscana soup from Olive Garden. The congee features a comforting base filled with ground pork, kale, garlic, and sliced potato.",
    category: "Soup",
    cuisine: "Asian",
    course: "Main",
    method: "",
    diet: "",
    rating: 5,
    reviews: 1,
  },
];

export function getAllRecipes() {
  return RECIPE_LIST.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

export function getRecipesByRating(sort: string) {
  return RECIPE_LIST.sort((a, b) => {
    const ratingA = a.rating;
    const ratingB = b.rating;

    if (ratingA < ratingB && sort === "highest") {
      return 1;
    }
    if (ratingA > ratingB && sort === "highest") {
      return -1;
    }
    if (ratingA < ratingB && sort === "lowest") {
      return -1;
    }
    if (ratingA > ratingB && sort === "lowest") {
      return 1;
    }

    return 0;
  });
}

export function getFeaturedRecipes() {
  return RECIPE_LIST.filter((recipe) => recipe.rating === 5);
}

export function getFilteredRecipes(
  recipeFilterId: string,
  recipeSubfilterId: string
) {
  return RECIPE_LIST.filter(
    (recipe: any) => recipe[recipeFilterId] === recipeSubfilterId
  );
}

export function getRecipesByCreator(creatorName: string) {
  return RECIPE_LIST.filter((recipe) => recipe.creatorId === creatorName);
}

export function getRecipeId(recipeId: string) {
  return RECIPE_LIST.find(
    (recipe) => recipe.name.toLowerCase() === recipeId.toLowerCase()
  );
}
