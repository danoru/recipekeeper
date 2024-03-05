import { CREATOR_LIST_TYPE } from "../types";

export const CREATOR_LIST: CREATOR_LIST_TYPE[] = [
  {
    name: "Andrew Rea of Babish Culinary Universe",
    image:
      "https://images.squarespace-cdn.com/content/v1/590be7fd15d5dbc6bf3e22d0/1494201957953-ON3OE3O0BBEV4JJANAO8/andrew.jpg?format=1000w",
    website: "https://linktr.ee/babishculinaryuniverse",
    instagram: "https://www.instagram.com/bingingwithbabish",
    youtube: "https://www.youtube.com/@babishculinaryuniverse",
  },
  {
    name: "Frankie Gaw of Little Fat Boy",
    image:
      "https://littlefatboy.com/media/pages/about-us/315f68bb38-1684966465/screen-shot-2023-05-24-at-3.14.16-pm.png",
    website: "https://littlefatboy.com",
    instagram: "https://www.instagram.com/littlefatboyfrankie/",
    youtube: "https://www.youtube.com/@LittleFatBoy",
  },
  {
    name: "Isabel Orozco-Moore of Isabel Eats",
    image:
      "https://www.isabeleats.com/wp-content/uploads/2023/02/isabel-orozco-moore-headshot.jpg",
    website: "https://www.isabeleats.com/",
    instagram: "https://www.instagram.com/isabeleats",
    youtube: "https://www.youtube.com/@isabeleatsrecipes",
  },
  {
    name: "Joshua Weismann",
    image:
      "https://static.wixstatic.com/media/827c6d_d7504c7b9e5d4615b60c993b202fe3dd~mv2.jpg/v1/crop/x_552,y_0,w_887,h_1106/fill/w_490,h_611,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/JW%20Bio%20Photo%20Aug2020-6_edited.jpg",
    website: "http://joshuaweissman.com",
    instagram: "https://www.instagram.com/joshuaweissman",
    youtube: "https://www.youtube.com/@JoshuaWeissman",
  },
  {
    name: "Wil Yeung of Yeung Man Cooking",
    image:
      "https://cdn.shopify.com/s/files/1/0423/1482/5885/files/wil_photo001_f3b9ae9f-a54c-4d87-b64e-02ec88dd9541_480x480.jpg?v=1593988665",
    website: "https://yeungmancooking.com/",
    instagram: "https://www.instagram.com/yeungmancooking/",
    youtube: "https://www.youtube.com/@YEUNGMANCOOKING",
  },
];

export function getFeaturedCreators() {
  return CREATOR_LIST;
}
