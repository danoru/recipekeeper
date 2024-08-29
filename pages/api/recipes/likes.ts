import prisma from "../../../src/data/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, userId, recipeId } = req.body;

  if (method === "POST") {
    try {
      const data = {
        recipeId,
        userId,
      };

      await prisma.likedRecipes.create({
        data,
      });
      res.status(200).json({ message: "Added to liked recipes." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add to liked recipes." });
    }
  } else if (method === "DELETE") {
    try {
      await prisma.likedRecipes.deleteMany({
        where: {
          userId,
          recipeId,
        },
      });
      res.status(200).json({ message: "Removed from liked recipes." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to remove from liked recipes." });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${method} is not allowed.`);
  }
}
