import { CREATOR_LIST_TYPE } from "../types";

export const CREATOR_LIST: CREATOR_LIST_TYPE[] = [
  {
    name: "Andrew Rea of Babish Culinary Universe",
    link: "babish",
    image:
      "https://images.squarespace-cdn.com/content/v1/590be7fd15d5dbc6bf3e22d0/1494201957953-ON3OE3O0BBEV4JJANAO8/andrew.jpg?format=1000w",
    website: "https://linktr.ee/babishculinaryuniverse",
    instagram: "https://www.instagram.com/bingingwithbabish",
    youtube: "https://www.youtube.com/@babishculinaryuniverse",
    isFeatured: false,
  },
  {
    name: "Budget Bytes",
    link: "budgetbytes",
    image:
      "https://www.budgetbytes.com/wp-content/uploads/2018/06/budgetbytes_logo.vFINALicon.white_.png",
    website: "https://www.budgetbytes.com",
    instagram: "https://www.instagram.com/budgetbytes/",
    youtube: "https://www.youtube.com/@BudgetBytesBlog",
    isFeatured: false,
  },
  {
    name: "Frankie Gaw of Little Fat Boy",
    link: "littlefatboy",
    image:
      "https://littlefatboy.com/media/pages/about-us/315f68bb38-1684966465/screen-shot-2023-05-24-at-3.14.16-pm.png",
    website: "https://littlefatboy.com",
    instagram: "https://www.instagram.com/littlefatboyfrankie/",
    youtube: "https://www.youtube.com/@LittleFatBoy",
    isFeatured: true,
  },
  {
    name: "Hyosun Ro of Korean Bapsang",
    link: "koreanbapsang",
    image:
      "https://www.koreanbapsang.com/wp-content/uploads/2023/11/Author-KB-New.png",
    website: "https://www.koreanbapsang.com/",
    instagram: "https://www.instagram.com/koreanbapsang/",
    youtube: "https://www.youtube.com/channel/UCMfhrjXVlCliSyj45ztHByA",
    isFeatured: false,
  },
  {
    name: "Isabel Orozco-Moore of Isabel Eats",
    link: "isabeleats",
    image:
      "https://www.isabeleats.com/wp-content/uploads/2023/02/isabel-orozco-moore-headshot.jpg",
    website: "https://www.isabeleats.com/",
    instagram: "https://www.instagram.com/isabeleats",
    youtube: "https://www.youtube.com/@isabeleatsrecipes",
    isFeatured: true,
  },
  {
    name: "Joshua Weismann",
    link: "joshuaweismann",
    image:
      "https://static.wixstatic.com/media/827c6d_d7504c7b9e5d4615b60c993b202fe3dd~mv2.jpg/v1/crop/x_552,y_0,w_887,h_1106/fill/w_490,h_611,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/JW%20Bio%20Photo%20Aug2020-6_edited.jpg",
    website: "http://joshuaweissman.com",
    instagram: "https://www.instagram.com/joshuaweissman",
    youtube: "https://www.youtube.com/@JoshuaWeissman",
    isFeatured: true,
  },
  {
    name: "Namiko Hirawasa Chen of Just One Cookbook",
    link: "justonecookbook",
    image:
      "https://www.justonecookbook.com/wp-content/uploads/2020/11/Nami-7893.jpg",
    website: "http://justonecookbook.com",
    instagram: "https://www.instagram.com/justonecookbook/",
    youtube: "https://www.youtube.com/@justonecookbook",
    isFeatured: false,
  },
  {
    name: "Wil Yeung of Yeung Man Cooking",
    link: "yeungmancooking",
    image:
      "https://cdn.shopify.com/s/files/1/0423/1482/5885/files/wil_photo001_f3b9ae9f-a54c-4d87-b64e-02ec88dd9541_480x480.jpg?v=1593988665",
    website: "https://yeungmancooking.com/",
    instagram: "https://www.instagram.com/yeungmancooking/",
    youtube: "https://www.youtube.com/@YEUNGMANCOOKING",
    isFeatured: true,
  },
];

export function getAllCreators() {
  return CREATOR_LIST;
}

export function getFilteredCreators() {
  return CREATOR_LIST.filter((creator) => creator.isFeatured);
}

export function getCreatorId(creatorName: string) {
  return CREATOR_LIST.find((creator) => creator.link === creatorName);
}
