import { NextApiRequest, NextApiResponse } from "next";

import { getRecipeNames } from "@/data/recipes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const recipes = await getRecipeNames();
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
