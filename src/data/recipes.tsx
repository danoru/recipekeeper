import { RECIPE_LIST_TYPE } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const RECIPE_LIST: RECIPE_LIST_TYPE[] = [
  {
    name: "Butternut Squash and Pork Lasagna",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/butternut-squash-and-pork-lasagna",
    image:
      "https://littlefatboy.com/media/pages/recipes/butternut-squash-and-pork-lasagna/8a9dafe748-1698875724/lasagna_hero.gif",
    description:
      "Traditional lasagna gets a fall makeover with a tomato butternut squash and pork sauce layered with ricotta mozarella and scallion.",
    category: "Pasta",
    cuisine: "Asian",
    course: "Main",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Taiwanese American Chicken Pot Pie",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/taiwanese-american-chicken-pot-pie",
    image:
      "https://littlefatboy.com/media/pages/recipes/taiwanese-american-chicken-pot-pie/01cc49ae12-1655261071/taiwanese_chicken_pot_pie.png",
    description:
      "A classic chicken pot pie with a filling made from onion, chicken thigh, potato, and carrots — but seasoned with classic Taiwanese grandma flavors like scallions, ginger, rice wine, and soy sauce.",
    category: "Chicken",
    cuisine: "Asian",
    course: "Main",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Banana Walnut Mochi Bread",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/banana-walnut-mochi-bread",
    image:
      "https://littlefatboy.com/media/pages/recipes/banana-walnut-mochi-bread/0a7ccdd835-1652838619/bananawalnutbread_3-27-22.png",
    description:
      "A tribute to classic banana bread with a chewy (and gluten-free!) twist. Rice flour steps in for a guest appearance to create new texture within this sweet and nutty bread.",
    category: "Other",
    cuisine: "Asian",
    course: "Dessert",
    method: "Classic",
    diet: "Gluten Free",
  },
  {
    name: "Chicken Pozole Verde",
    creatorId: "isabeleats",
    link: "https://www.isabeleats.com/chicken-pozole-verde/",
    image:
      "https://www.isabeleats.com/wp-content/uploads/2022/10/pozole-verde-small-8.jpg",
    description:
      "Pozole Verde is a comforting Mexican stew filled with shredded chicken and hominy in a delicious green chile broth made from tomatillos, jalapeños, and cilantro. It’s easy to make, hearty, and ready in only one hour!",
    category: "Soup",
    cuisine: "North American",
    course: "Main",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Zuppa Tuscana Congee",
    creatorId: "littlefatboy",
    link: "https://littlefatboy.com/recipes/zuppa-toscana-congee",
    image:
      "https://littlefatboy.com/media/pages/recipes/zuppa-toscana-congee/065608820d-1655350789/zuppa_toscana_congee_pink_6-15-22.png",
    description:
      "Simple congee serves as the perfect base for the flavors of the iconic Zuppa Toscana soup from Olive Garden. The congee features a comforting base filled with ground pork, kale, garlic, and sliced potato.",
    category: "Soup",
    cuisine: "Asian",
    course: "Main",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Slow Cooker White Chicken Chili",
    creatorId: "budgetbytes",
    link: "https://www.budgetbytes.com/slow-cooker-white-chicken-chili/",
    image:
      "https://www.budgetbytes.com/wp-content/uploads/2015/01/Slow-Cooker-White-Chicken-Chili-bowls-V2-768x1024.jpg",
    description:
      "This Slow Cooker White Chicken Chili is the perfect example of why people love slow cookers so much. You literally just dump everything in the slow cooker, give it a quick stir, then turn it on and walk away. When you come back you have this hearty white bean chicken chili that’s ready for topping with creamy cheese and diving in with some tortilla chips. And when the sky is dark, the air is cold, and you’ve got the winter blues, easy dinners like this are a total life saver!",
    category: "Soup",
    cuisine: "North American",
    course: "Main",
    method: "Slow Cooker",
    diet: "None",
  },
  {
    name: "Spicy Creamy Mushroom Pasta",
    creatorId: "sipandfeast",
    link: "https://www.sipandfeast.com/spicy-creamy-mushroom-pasta/",
    image:
      "https://www.sipandfeast.com/wp-content/uploads/2023/01/spicy-creamy-mushroom-pasta-recipe-6.jpg",
    description:
      "Spicy creamy mushroom pasta is what we make when we are craving a little bit of heat.  Spicy Calabrian chili paste, tomato paste, and cream are tossed with sauteed mushrooms, pasta, fresh basil, and Pecorino Romano cheese and can be ready in about 30 minutes.",
    category: "Pasta",
    cuisine: "European",
    course: "Mains",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Middle Eastern Inspired Ground Beef Bowls",
    creatorId: "tablefortwo",
    link: "https://www.tablefortwoblog.com/middle-eastern-inspired-ground-beef-bowls/",
    image:
      "https://www.tablefortwoblog.com/wp-content/uploads/2022/08/middle-eastern-beef-bowls-recipe-photo-tablefortwoblog-3-800x1200.jpg",
    description:
      "The ground beef is made simply mouthwatering with spices like coriander, cumin, and cayenne. It’s deliciously savory, which makes it balance well with the fresh ingredients. These bowls really have it all!",
    category: "Beef",
    cuisine: "Middle Eastern",
    course: "Mains",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Pressure Cooker Japanese Curry",
    creatorId: "justonecookbook",
    link: "https://www.justonecookbook.com/pressure-cooker-japanese-curry/",
    image:
      "https://www.justonecookbook.com/wp-content/uploads/2016/03/Pressure-Cooker-Curry-IV.jpg",
    description:
      "Have you heard of Japanese curry or Curry Rice (Karē Raisu)? If not, it’s best described as mild and thick curry. Even though curry was originally from Southeast Asia, it has become one of the most popular foods in Japan enjoyed by people of all ages.",
    category: "Chicken",
    cuisine: "Asian",
    course: "Mains",
    method: "Pressure Cooker",
    diet: "None",
  },
  {
    name: "Cajun Sausage and Rice Skillet",
    creatorId: "budgetbytes",
    link: "https://www.budgetbytes.com/cajun-sausage-and-rice-skillet/",
    image:
      "https://www.budgetbytes.com/wp-content/uploads/2020/09/Cajun-Sausage-and-Rice-Skillet-front-500x500.jpg",
    description:
      "This easy Cajun Sausage and Rice Skillet is the perfect easy and filling weeknight dinner, packed with plenty of smoky-spicy flavor!",
    category: "Pork",
    cuisine: "North American",
    course: "Mains",
    method: "One Pot",
    diet: "None",
  },
  {
    name: "Taco Soup",
    creatorId: "isabeleats",
    link: "https://www.isabeleats.com/taco-soup-recipe/",
    image:
      "https://www.isabeleats.com/wp-content/uploads/2023/02/taco-soup-recipe-small-9.jpg",
    description:
      "This taco soup recipe is hearty, healthy, and ready in under 1 hour! Made with ground beef, taco seasoning, canned beans, corn, bell peppers, and other veggies, it’s perfect served with your favorite taco toppings and tortilla chips for a little crunch.",
    category: "Soup",
    cuisine: "North American",
    course: "Mains",
    method: "One Pot",
    diet: "None",
  },
  {
    name: "Oyakodon",
    creatorId: "justonecookbook",
    link: "https://www.justonecookbook.com/oyakodon/",
    image:
      "https://www.justonecookbook.com/wp-content/uploads/2022/10/Oyakodon-0595-II.jpg",
    description:
      "Oyakodon is a classic comfort food of Japanese home cooking. Tender pieces of chicken, onions, and eggs are simmered in an umami-rich sauce and then poured over a bowl of fluffy steamed rice. Simple, delicious, and utterly comforting, this is the kind of one-bowl meal you can cook in less than 30 minutes!",
    category: "Chicken",
    cuisine: "Asian",
    course: "Mains",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Black Pepper Stir Fried Udon",
    creatorId: "pinchofyum",
    link: "https://pinchofyum.com/black-pepper-stir-fried-udon",
    image:
      "https://pinchofyum.com/cdn-cgi/image/width=680,height=99999,fit=scale-down/wp-content/uploads/Udon-2-scaled.jpg",
    description:
      "This Black Pepper Stir Fried Udon is the perfect SOS dinner! Saucy udon noodles, dark soy sauce, stir fry veggies, fresh garlic, and lots of freshly ground black pepper. So easy!",
    category: "Noodles",
    cuisine: "Asian",
    course: "Mains",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Easy American Goulash",
    creatorId: "budgetbytes",
    link: "https://www.budgetbytes.com/goulash/",
    image:
      "https://www.budgetbytes.com/wp-content/uploads/2010/10/American-Goulash-V3-768x1024.jpg",
    description:
      "This One Pot American Goulash is the ultimate comfort food with the richest, most yummiest red sauce ever, thanks to a splash of red wine. Seriously, you’ve got to try this one.",
    category: "Beef",
    cuisine: "North American",
    course: "Mains",
    method: "One Pot",
    diet: "None",
  },
  {
    name: "Creamy Roasted Red Pepper Pasta",
    creatorId: "thegoodbite",
    link: "https://www.thegoodbite.co.uk/recipes/creamy-roasted-red-pepper-pasta-2/",
    image:
      "https://www.thegoodbite.co.uk/wp-content/uploads/2020/10/Untitled-1-36-1200x800.jpg",
    description:
      "This Roasted Red Pepper Pasta is so creamy and rich in flavour you can hardly believe it’s vegan, not to mention seriously easy to knock up and super healthy.",
    category: "Pasta",
    cuisine: "European",
    course: "Mains",
    method: "Classic",
    diet: "Vegan",
  },
  {
    name: "Dressed Up French Style Flatbread from Trader Joe's 2 Ways",
    creatorId: "traderjoesfiveitemsorless",
    link: "https://traderjoes5itemsorless.com/dressed-up-french-style-flatbread-from-trader-joes-2-ways/",
    image:
      "https://traderjoes5itemsorless.com/wp-content/uploads/2023/06/flatbread-pic1-996x1024.jpeg",
    description:
      "Need ideas for an easy, light lunch or dinner, or even breakfast? Try this super tasty, dressed-up french style flatbread from Trader Joe’s!",
    category: "Other",
    cuisine: "European",
    course: "Mains",
    method: "Classic",
    diet: "Vegan",
  },
  {
    name: "Paleo Egg Drop Soup",
    creatorId: "iheartumami",
    link: "https://iheartumami.com/hearty-chinese-egg-drop-soup/",
    image:
      "https://iheartumami.com/wp-content/uploads/2016/09/Egg-drop-soup-with-bone-broth.jpg",
    description:
      "You’ll fall in love with my mom’s Paleo Egg Drop Soup fast! With fluffy egg flowers, the most delicious savory broth, and healthy lean protein, this version is not only delicious but also super easy to make. It’s not only tasty but also packed with nutrition and healthy goodness.",
    category: "Soup",
    cuisine: "Asian",
    course: "Mains",
    method: "Classic",
    diet: "Paleo",
  },
  {
    name: "Air Fryer Taiwanese Popcorn Chicken",
    creatorId: "cjeats",
    link: "https://cjeatsrecipes.com/air-fryer-taiwanese-popcorn-chicken/",
    image:
      "https://cjeatsrecipes.com/wp-content/uploads/2023/11/Air-Fryer-Taiwanese-Popcorn-Chicken-Close-Up-in-bowl-684x1024.jpg",
    description:
      "You loved my Taiwanese Popcorn Chicken recipe, so I had to develop an Air Fryer Taiwanese Popcorn Chicken that came out JUST as crispy as the regular version! The chicken is juicy and delicious, with my tips for making the Air Fryer Taiwanese Popcorn Chicken below! You’ll love the crispy texture – I guarantee it!",
    category: "Chicken",
    cuisine: "Asian",
    course: "Appetizers",
    method: "Air Fryer",
    diet: "None",
  },
  {
    name: "Tender Chicken and Broccoli",
    creatorId: "smellylunchbox",
    link: "https://smellylunchbox.com/chicken-and-broccoli/",
    image:
      "https://smellylunchbox.com/wp-content/uploads/2023/06/chickenandbroccoli-720x866.webp",
    description:
      "This tender chicken and broccoli recipe features juicy pieces of chicken breast, and broccoli that soaks up all the delicious, savory sauce!",
    category: "Chicken",
    cuisine: "Asian",
    course: "Mains",
    method: "Classic",
    diet: "None",
  },
  {
    name: "Dairy-Free Marry Me Chicken",
    creatorId: "oliviaadriance",
    link: "https://oliviaadriance.com/dairy-free-marry-me-chicken/",
    image:
      "https://oliviaadriance.com/wp-content/uploads/2024/05/Final_1_Marry_Me_Chicken-1.jpg.webp",
    description:
      "Looking for an indulgent, but still healthy weeknight dinner? My take on the trending Marry Me Chicken is sure to hit the spot. For my dairy-free version, the chicken is pan-seared before it’s cooked together with a creamy and oh so delicious sauce.",
    category: "Chicken",
    cuisine: "North American",
    course: "Mains",
    method: "Classic",
    diet: "Dairy Free",
  },
  {
    name: "One Pan Mango and Lime Coconut Chicken",
    creatorId: "emthenutrionist",
    link: "https://www.instagram.com/emthenutritionist/reel/CsrFFj0I2l9/",
    image: "https://i.imgur.com/swENhzK.png",
    description:
      "If you are looking for the perfect summer dinner, this one pan mango and lime coconut chicken is a winner. Fresh but aromatic, filling but light. Swap the protein around for salmon or tofu and use whatever veg you may have laying around in your fridge!",
    category: "Chicken",
    cuisine: "North American",
    course: "Mains",
    method: "One Pan",
    diet: "None",
  },
];

export async function getAllRecipes() {
  const recipes = await prisma.recipes.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return recipes;
}

export async function getRecipeByName(name: string) {
  const recipe = await prisma.recipes.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive", // Case-insensitive comparison
      },
    },
    include: { creators: true },
  });
  return recipe;
}

export async function getRecipesByRating(sort: string) {
  const orderBy = sort === "highest" ? "desc" : "asc";

  const recipes = await prisma.recipes.findMany({
    include: {
      reviews: true,
    },
  });

  const sortedRecipes = recipes
    .map((recipe) => {
      const totalRating = recipe.reviews.reduce((sum, review) => {
        return sum + (review.rating || 0);
      }, 0);
      const averageRating = recipe.reviews.length
        ? totalRating / recipe.reviews.length
        : 0;
      return { ...recipe, averageRating };
    })
    .sort((a, b) =>
      orderBy === "desc"
        ? b.averageRating - a.averageRating
        : a.averageRating - b.averageRating
    );

  return sortedRecipes;
}

export async function getFavoriteRecipes(userId: number) {
  const favoriteRecipes = await prisma.favoritesRecipes.findMany({
    where: { userId },
    include: { recipes: true },
  });
  return favoriteRecipes;
}

export async function getFeaturedRecipes() {
  const recipes = await prisma.recipes.findMany({
    include: {
      reviews: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const featuredRecipes = recipes.filter((recipe) => {
    const totalRating = recipe.reviews.reduce((sum, review) => {
      return sum + (review.rating || 0);
    }, 0);
    const averageRating = recipe.reviews.length
      ? totalRating / recipe.reviews.length
      : 0;
    return averageRating === 5;
  });

  return featuredRecipes;
}

export async function getFilteredRecipes(
  filterId: string,
  subfilterId: string
) {
  const recipes = await prisma.recipes.findMany({
    where: {
      [filterId]: subfilterId,
    },
    orderBy: {
      name: "asc",
    },
  });
  return recipes;
}

export async function getRecipesByCreator(creatorName: string) {
  const recipes = await prisma.recipes.findMany({
    where: {
      creators: {
        name: creatorName,
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  return recipes;
}

export async function getTopLikedRecipes(userId: number) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: { following: { select: { followingUsername: true } } },
  });

  const followingList = user?.following.map((f) => f.followingUsername) || [];

  const recipeCount: { [key: number]: number } = {};

  for (const username of followingList) {
    const user = await prisma.users.findUnique({
      where: { username },
      include: { likedRecipes: true },
    });

    if (user?.likedRecipes) {
      for (const likedRecipe of user.likedRecipes) {
        const recipeId = Number(likedRecipe.recipeId); // Ensure recipeId is parsed as number
        if (recipeId in recipeCount) {
          recipeCount[recipeId]++;
        } else {
          recipeCount[recipeId] = 1;
        }
      }
    }
  }

  const sortedRecipes = Object.keys(recipeCount).map((recipeId) => ({
    recipeId: Number(recipeId), // Parse recipeId as number
    count: recipeCount[Number(recipeId)],
  }));

  const topLikedRecipes = sortedRecipes
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topRecipesDetails = await Promise.all(
    topLikedRecipes.map(async (recipe) => {
      const fullRecipeDetails = await prisma.recipes.findUnique({
        where: { id: recipe.recipeId },
      });
      return fullRecipeDetails;
    })
  );

  return topRecipesDetails;
}

export async function getCooklist(userId: number) {
  const cooklist = await prisma.cooklist.findMany({
    where: {
      userId,
    },
    include: {
      recipes: true,
    },
  });
  return cooklist;
}
