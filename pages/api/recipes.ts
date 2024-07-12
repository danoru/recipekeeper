import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../src/data/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const recipes = await prisma.recipes.findMany();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
