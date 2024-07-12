import prisma from "../../../src/data/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, recipeId, date, hasCookedBefore, comment, rating } =
      req.body;

    try {
      const newEntry = await prisma.diaryEntries.create({
        data: {
          userId,
          recipeId,
          rating,
          comment,
          date,
          hasCookedBefore,
        },
      });
      res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error logging recipe:", error);
      res.status(500).json({ error: "Failed to log recipe." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
