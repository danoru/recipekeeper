import { USER_LIST_TYPE } from "../types";

export const USER_LIST: USER_LIST_TYPE[] = [
  {
    username: "danoru",
    profile: { name: "Daniel" },
    favorites: {
      recipes: [
        "Butternut Squash and Pork Lasagna",
        "Taiwanese American Chicken Pot Pie",
        "Chicken Pozole Verde",
        "Zuppa Tuscana Congee",
      ],
      creators: ["littlefatboy", "budgetbytes", "koreanbapsang", "isabeleats"],
    },
  },
  {
    username: "chiquitabananna",
    profile: { name: "Anna" },
    favorites: {
      recipes: [
        "Chicken Pozole Verde",
        "Butternut Squash and Pork Lasagna",
        "Banana Walnut Mochi Bread",
        "Zuppa Tuscana Congee",
      ],
      creators: [
        "yeungmancooking",
        "koreanbapsang",
        "joshuaweismann",
        "justonecookbook",
      ],
    },
  },
  {
    username: "boeboekitty",
    profile: { name: "Boe" },
    favorites: {
      recipes: [
        "Spicy Creamy Mushroom Pasta",
        "Middle Eastern Inspired Ground Beef Bowls",
        "Pressure Cooker Japanese Curry",
        "Cajun Sausage and Rice Skillet",
      ],
      creators: [
        "jkenjilopezalt",
        "budgetbytes",
        "tablefortwo",
        "rainbowplantlife",
      ],
    },
  },
];

export function getAllUsers() {
  return USER_LIST;
}
