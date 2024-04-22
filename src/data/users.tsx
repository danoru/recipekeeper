import { USER_LIST_TYPE } from "../types";

export const USER_LIST: USER_LIST_TYPE[] = [
  {
    username: "danoru",
    profile: {
      name: "Daniel",
      email: "",
      password: "",
      image: "",
      bio: "This is where my bio would go—if I had one!",
      location: "Los Angeles, CA",
      badge: "HQ",
      joinDate: "2024-02-24",
    },
    cooklist: ["Spicy Creamy Mushroom Pasta"],
    diary: [
      {
        recipe: "Chicken Pozole Verde",
        rating: 5,
        comment:
          "My wife loves this meal, it is one of her favorite things that I make. The only change I make is that sometimes I will roast the veggies before they are added for an extra depth of flavor.",
        date: "2024-04-10",
        hasCookedBefore: true,
      },
      {
        recipe: "Taiwanese American Chicken Pot Pie",
        rating: 5,
        comment:
          "Made this recipe for some friends and it was a big hit! Just make sure you have a big enough cast iron or your fire alarm might go off.",
        date: "2024-04-15",
        hasCookedBefore: true,
      },
    ],
    favorites: {
      recipes: [
        "Butternut Squash and Pork Lasagna",
        "Taiwanese American Chicken Pot Pie",
        "Chicken Pozole Verde",
        "Zuppa Tuscana Congee",
      ],
      creators: ["littlefatboy", "budgetbytes", "koreanbapsang", "isabeleats"],
    },
    following: ["chiquitabananna", "boeboekitty"],
  },
  {
    username: "chiquitabananna",
    profile: {
      name: "Anna",
      email: "",
      password: "",
      image: "",
      bio: "",
      location: "",
      badge: "Patron",
      joinDate: "2024-02-24",
    },
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
    following: ["danoru", "boeboekitty"],
  },
  {
    username: "boeboekitty",
    profile: {
      name: "Boe",
      email: "",
      password: "",
      image: "",
      bio: "",
      location: "",
      joinDate: "2024-04-10",
    },
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
    following: ["chiquitabananna", "danoru"],
  },
];

export function getAllUsers() {
  return USER_LIST;
}
