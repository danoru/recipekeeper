import prisma from "./db";

export const USER_LIST = [
  {
    username: "danoru",
    profile: {
      name: "Daniel",
      email: "",
      image: "",
      bio: "This is where my bio would go—if I had one!",
      location: "Los Angeles, CA",
      badge: "HQ",
      joinDate: "2024-02-24",
    },
    cooklist: ["Spicy Creamy Mushroom Pasta", "Oyakodon"],
    diary: [
      {
        recipe: "Taco Soup",
        rating: 4,
        comment:
          "This was a hit with my wife and daughter, but I think it could have used a bit more seasoning for my taste.",
        date: "2024-05-01",
        hasCookedBefore: false,
      },
      {
        recipe: "Cajun Sausage and Rice Skillet",
        rating: 3.5,
        comment:
          "This is a good, quick weeknight meal. For my family's preferences, I think I will add some extra vegetables to the recipe next time as it was somewhat one note in flavor and texture.",
        date: "2024-04-26",
        hasCookedBefore: true,
      },
      {
        recipe: "Black Pepper Stir Fried Udon",
        rating: 4,
        comment:
          "I really enjoyed the depth of flavor in this dish. I added mushrooms in place of a protein (though this calls for neither) and it was very good.",
        date: "2024-04-24",
        hasCookedBefore: false,
      },
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
    liked: {
      recipes: [
        "Butternut Squash and Pork Lasagna",
        "Taiwanese American Chicken Pot Pie",
        "Chicken Pozole Verde",
        "Zuppa Tuscana Congee",
      ],
      creators: [
        "littlefatboy",
        "budgetbytes",
        "koreanbapsang",
        "isabeleats",
        "joshuaweismann",
      ],
    },
    following: ["chiquitabananna", "boeboe", "mallorylaabs"],
  },
  {
    username: "chiquitabananna",
    profile: {
      name: "Anna",
      email: "",
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
    liked: {
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
        "littlefatboy",
      ],
    },
    following: ["danoru", "boeboe", "mallorylaabs"],
  },
  {
    username: "boeboe",
    profile: {
      name: "Boe",
      email: "",
      image: "",
      bio: "",
      location: "",
      joinDate: "2024-04-10",
    },
    diary: [
      {
        recipe: "Easy American Goulash",
        rating: 5,
        date: "2024-05-19",
        hasCookedBefore: true,
      },
    ],
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
    liked: {
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
  {
    username: "mallorylaabs",
    profile: {
      name: "Mallory",
      joinDate: "2024-05-22",
    },
    diary: [
      {
        recipe: "Creamy Roasted Red Pepper Pasta",
        rating: 4,
        date: "2024-05-21",
        hasCookedBefore: true,
      },
      {
        recipe: "Dressed Up French Style Flatbread from Trader Joe's 2 Ways",
        rating: 5,
        date: "2024-05-14",
        hasCookedBefore: false,
      },
    ],
    favorites: {
      recipes: [
        "One Pan Mango and Lime Coconut Chicken",
        "Tender Chicken and Broccoli",
        "Air Fryer Taiwanese Popcorn Chicken",
        "Dairy-Free Marry Me Chicken",
      ],
      creators: ["cafemaddy", "cjeats", "oliviaadriance", "emthenutrionist"],
    },
    liked: {
      recipes: ["Mango Lime Coconut Chicken", "Tender Chicken and Broccoli"],
      creators: ["cafemaddy", "cjeats", "oliviaadriance", "emthenutrionist"],
    },
    following: ["danoru", "chiquitabananna", "boeboe"],
  },
  {
    username: "guest",
    profile: {
      name: "Guest",
      joinDate: "2024-05-22",
    },
    cooklist: ["Spicy Creamy Mushroom Pasta", "Oyakodon"],
    diary: [
      {
        recipe: "Taco Soup",
        rating: 4,
        comment:
          "This was a hit with my wife and daughter, but I think it could have used a bit more seasoning for my taste.",
        date: "2024-05-01",
        hasCookedBefore: false,
      },
      {
        recipe: "Cajun Sausage and Rice Skillet",
        rating: 3.5,
        comment:
          "This is a good, quick weeknight meal. For my family's preferences, I think I will add some extra vegetables to the recipe next time as it was somewhat one note in flavor and texture.",
        date: "2024-04-26",
        hasCookedBefore: true,
      },
      {
        recipe: "Black Pepper Stir Fried Udon",
        rating: 4,
        comment:
          "I really enjoyed the depth of flavor in this dish. I added mushrooms in place of a protein (though this calls for neither) and it was very good.",
        date: "2024-04-24",
        hasCookedBefore: false,
      },
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
    liked: {
      recipes: [
        "Butternut Squash and Pork Lasagna",
        "Taiwanese American Chicken Pot Pie",
        "Chicken Pozole Verde",
        "Zuppa Tuscana Congee",
      ],
      creators: [
        "littlefatboy",
        "budgetbytes",
        "koreanbapsang",
        "isabeleats",
        "joshuaweismann",
      ],
    },
    following: ["danoru", "chiquitabananna", "boeboe", "mallorylaabs"],
  },
];
export async function getAllUsers() {
  const users = await prisma.users.findMany({
    orderBy: {
      username: "asc",
    },
  });
  return users;
}

export async function findUserByUserId(id: number) {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  return user;
}

export async function findUserByUsername(username: string) {
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
  });
  return user;
}

export async function getUserProfile(username: string) {
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
    include: {
      cooklist: { include: { recipes: true } },
      diaryEntries: {
        include: { recipes: true, users: true },
        orderBy: { date: "desc" },
      },
      favoritesCreators: { include: { creators: true } },
      favoritesRecipes: { include: { recipes: true } },
      following: true,
      reviews: { include: { recipes: true } },
    },
  });
  return user;
}

export async function getFollowers(username: string) {
  const followers = await prisma.following.findMany({
    where: {
      followingUsername: username,
    },
    include: {
      users: true,
    },
  });
  return followers;
}

export async function getFollowing(userId: number) {
  const following = await prisma.following.findMany({
    where: {
      userId,
    },
    include: {
      users: true,
    },
  });

  return following;
}

export async function getUserLikes(username: string) {
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
    include: {
      likedCreators: {
        include: {
          creators: true,
        },
      },
      likedRecipes: {
        include: {
          recipes: true,
        },
      },
    },
  });
  return user;
}

export async function followUser(userId: number, followingUsername: string) {
  try {
    await fetch("/api/user/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        followingUsername,
        action: "follow",
      }),
    });
  } catch (error) {
    console.error("Failed to follow user:", error);
  }
}

export async function unfollowUser(userId: number, followingUsername: string) {
  try {
    await fetch("/api/user/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        followingUsername,
        action: "unfollow",
      }),
    });
  } catch (error) {
    console.error("Failed to unfollow user:", error);
  }
}
