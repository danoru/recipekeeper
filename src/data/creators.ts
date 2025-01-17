import prisma from "./db";
import { getFollowingList } from "./users";

export const CREATOR_LIST = [
  {
    name: "Babish Culinary Universe",
    link: "babish",
    image:
      "https://images.squarespace-cdn.com/content/v1/590be7fd15d5dbc6bf3e22d0/1494201957953-ON3OE3O0BBEV4JJANAO8/andrew.jpg?format=1000w",
    website: "https://linktr.ee/babishculinaryuniverse",
    instagram: "https://www.instagram.com/bingingwithbabish",
    youtube: "https://www.youtube.com/@babishculinaryuniverse",
  },
  {
    name: "Budget Bytes",
    link: "budgetbytes",
    image:
      "https://www.budgetbytes.com/wp-content/uploads/2018/06/budgetbytes_logo.vFINALicon.white_.png",
    website: "https://www.budgetbytes.com",
    instagram: "https://www.instagram.com/budgetbytes/",
    youtube: "https://www.youtube.com/@BudgetBytesBlog",
  },
  {
    name: "Little Fat Boy",
    link: "littlefatboy",
    image:
      "https://littlefatboy.com/media/pages/about-us/315f68bb38-1684966465/screen-shot-2023-05-24-at-3.14.16-pm.png",
    website: "https://littlefatboy.com",
    instagram: "https://www.instagram.com/littlefatboyfrankie/",
    youtube: "https://www.youtube.com/@LittleFatBoy",
  },
  {
    name: "Korean Bapsang",
    link: "koreanbapsang",
    image:
      "https://www.koreanbapsang.com/wp-content/uploads/2023/11/Author-KB-New.png",
    website: "https://www.koreanbapsang.com/",
    instagram: "https://www.instagram.com/koreanbapsang/",
    youtube: "https://www.youtube.com/channel/UCMfhrjXVlCliSyj45ztHByA",
  },
  {
    name: "J. Kenji Lopez-Alt",
    link: "jkenjilopezalt",
    image:
      "https://images.squarespace-cdn.com/content/v1/55b880f7e4b0fdc3eabeed4c/5e7857d2-ea39-4eed-9ea4-cef569986e5f/7I0A2881-FINAL+copy+2+small.jpg?format=1000w",
    website: "https://www.kenjilopezalt.com/",
    instagram: "https://www.instagram.com/kenjilopezalt/",
    youtube: "https://www.youtube.com/@JKenjiLopezAlt",
  },
  {
    name: "Isabel Eats",
    link: "isabeleats",
    image:
      "https://www.isabeleats.com/wp-content/uploads/2023/02/isabel-orozco-moore-headshot.jpg",
    website: "https://www.isabeleats.com/",
    instagram: "https://www.instagram.com/isabeleats",
    youtube: "https://www.youtube.com/@isabeleatsrecipes",
  },
  {
    name: "Joshua Weismann",
    link: "joshuaweismann",
    image:
      "https://static.wixstatic.com/media/827c6d_d7504c7b9e5d4615b60c993b202fe3dd~mv2.jpg/v1/crop/x_552,y_0,w_887,h_1106/fill/w_490,h_611,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/JW%20Bio%20Photo%20Aug2020-6_edited.jpg",
    website: "http://joshuaweissman.com",
    instagram: "https://www.instagram.com/joshuaweissman",
    youtube: "https://www.youtube.com/@JoshuaWeissman",
  },
  {
    name: "Just One Cookbook",
    link: "justonecookbook",
    image:
      "https://www.justonecookbook.com/wp-content/uploads/2020/11/Nami-7893.jpg",
    website: "http://justonecookbook.com",
    instagram: "https://www.instagram.com/justonecookbook/",
    youtube: "https://www.youtube.com/@justonecookbook",
  },
  {
    name: "Pinch of Yum",
    link: "pinchofyum",
    image:
      "https://pinchofyum.com/wp-content/assets/images/sidebar/sidebar-lindsay.jpg",
    website: "https://pinchofyum.com/",
    instagram: "https://www.instagram.com/pinchofyum",
    youtube: "https://www.youtube.com/@pinchofyum",
  },
  {
    name: "Rainbow Plant Life",
    link: "rainbowplantlife",
    image: "https://rainbowplantlife.com/wp-content/uploads/2020/10/nisha1.jpg",
    website: "https://rainbowplantlife.com/",
    instagram: "https://www.instagram.com/rainbowplantlife/",
    youtube: "https://www.youtube.com/channel/UCDbZvuDA_tZ6XP5wKKFuemQ",
  },
  {
    name: "Sip and Feast",
    link: "sipandfeast",
    image:
      "https://www.sipandfeast.com/wp-content/uploads/2023/10/family-10-30-23.jpg",
    website: "https://sipandfeast.com/",
    instagram: "https:www.instagram.com/sipandfeast/",
    youtube: "https:www.youtube.com/sipandfeast",
  },
  {
    name: "Table for Two",
    link: "tablefortwo",
    image:
      "https://www.tablefortwoblog.com/wp-content/uploads/2024/01/2024-headshots-julie-chiou-tablefortwoblog-17.jpg",
    website: "https://www.tablefortwoblog.com/",
    instagram: "https://www.instagram.com/tablefortwo/",
    youtube: "https://www.youtube.com/@tablefortwoblog",
  },
  {
    name: "The Good Bite",
    link: "thegoodbite",
    image:
      "https://www.thegoodbite.co.uk/wp-content/uploads/2020/10/WhatsApp-Image-2020-08-14-at-12.21.22.jpeg",
    website: "https://www.thegoodbite.co.uk/",
    instagram: "https://www.instagram.com/thegoodbite/",
    youtube: "https://www.youtube.com/@thegoodbite9270",
  },
  {
    name: "Trader Joe's Five Items or Less",
    link: "traderjoesfiveitemsorless",
    image:
      "https://traderjoes5itemsorless.com/wp-content/uploads/2022/07/sidebar-image.jpg",
    website: "https://traderjoes5itemsorless.com/",
    instagram: "https://www.instagram.com/traderjoes5itemsorless/",
    youtube: "https://www.youtube.com/@thegoodbite9270",
  },
  {
    name: "Yeung Man Cooking",
    link: "yeungmancooking",
    image:
      "https://cdn.shopify.com/s/files/1/0423/1482/5885/files/wil_photo001_f3b9ae9f-a54c-4d87-b64e-02ec88dd9541_480x480.jpg?v=1593988665",
    website: "https://yeungmancooking.com/",
    instagram: "https://www.instagram.com/yeungmancooking/",
    youtube: "https://www.youtube.com/@YEUNGMANCOOKING",
  },
  {
    name: "Cafe Maddy",
    link: "cafemaddy",
    image:
      "https://images.squarespace-cdn.com/content/v1/5ea23fb05a9d5e5bf1c24291/1588457654277-S2LCLNAN9Q16K645IF0Q/KakaoTalk_Photo_2020-04-30-13-06-06.jpeg?format=2500w",
    website: "https://www.cafemaddy.com/",
    instagram: "https://www.instagram.com/cafemaddy",
    youtube: "https://www.youtube.com/@CafeMaddy",
  },
  {
    name: "I Heart Umami",
    link: "iheartumami",
    image: "https://iheartumami.com/wp-content/uploads/2019/03/ChihYu-2.jpg",
    website: "https://www.iheartumami.com/",
    instagram: "https://www.instagram.com/iheartumami.ny",
    youtube: "https://www.youtube.com/channel/UCqaK0m5Q86OEIsF8CB_-AOA",
  },
  {
    name: "Olivia Adriance",
    link: "oliviaadriance",
    image:
      "https://oliviaadriance.com/wp-content/uploads/2023/12/Olivia_Adriance_LIfestly_Book_20-copy.jpg.webp",
    website: "https://oliviaadriance.com/",
    instagram: "https://www.instagram.com/olivia.adriance/",
    youtube: "https://www.youtube.com/@oliviaadriance",
  },
  {
    name: "CJ Eats",
    link: "cjeats",
    image: "https://cjeatsrecipes.com/wp-content/uploads/2022/04/CJ.webp",
    website: "https://cjeatsrecipes.com/",
    instagram: "https://www.instagram.com/cj.eats_/",
    youtube: "https://www.youtube.com/cjeats",
  },
  {
    name: "Smelly Lunchbox",
    link: "smellylunchbox",
    image:
      "https://smellylunchbox.com/wp-content/uploads/2023/07/prof-pic-300x300.webp",
    website: "https://smellylunchbox.com/",
    instagram: "https://www.instagram.com/smelly.lunchbox/",
    youtube: "https://www.youtube.com/@smelly.lunchbox",
  },
  {
    name: "Em the Nutrionist",
    link: "emthenutrionist",
    image:
      "https://images.squarespace-cdn.com/content/v1/5e4568acaa27976632444349/1632398240985-8VR607FBAWF669Z29T6I/IMG_1021.JPG",
    website: "https://emilyenglish.com/",
    instagram: "https://www.instagram.com/emthenutrionist/",
    youtube: "https://www.youtube.com/@Emily.english",
  },
];

export async function getAllCreators() {
  const creators = await prisma.creators.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return creators;
}

export async function getFeaturedCreators() {
  const featuredCreators = await prisma.creators.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return featuredCreators;
}

export async function getCreatorByLink(creatorLink: string) {
  return await prisma.creators.findUnique({
    where: {
      link: creatorLink,
    },
  });
}

export async function getFavoriteCreators(userId: number) {
  const favoriteCreators = await prisma.favoritesCreators.findMany({
    where: { userId },
    include: { creators: true },
  });
  return favoriteCreators;
}

export async function getTopLikedCreators(userId: number) {
  const followingList = (await getFollowingList(userId)) || [];

  const likedCreators = await prisma.likedCreators.findMany({
    where: {
      users: {
        username: {
          in: followingList,
        },
      },
    },
    select: {
      creatorId: true,
    },
  });

  const creatorCount = likedCreators.reduce((acc, { creatorId }) => {
    acc[creatorId] = (acc[creatorId] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const topCreatorIds = Object.entries(creatorCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([creatorId]) => creatorId);

  const topCreatorsDetails = await prisma.creators.findMany({
    where: {
      link: {
        in: topCreatorIds,
      },
    },
  });

  return topCreatorsDetails;
}
