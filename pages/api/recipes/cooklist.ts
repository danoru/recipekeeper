import prisma from "../../../src/data/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, recipeId, userId } = req.body;

  if (method === "POST") {
    try {
      await prisma.cooklist.create({
        data: {
          recipeId,
          userId,
        },
      });
      res.status(200).json({ message: "Added to cooklist." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add to cooklist." });
    }
  } else if (method === "DELETE") {
    try {
      await prisma.cooklist.deleteMany({
        where: {
          recipeId,
          userId,
        },
      });
      res.status(200).json({ message: "Removed from cooklist." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to remove from cooklist." });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${method} is not allowed.`);
  }
}
