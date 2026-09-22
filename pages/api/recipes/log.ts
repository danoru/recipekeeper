import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/data/db";
import { requireApiUser, revalidateUserPages } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  const user = await requireApiUser(req, res);
  if (!user) return;

  const { recipeId, date, hasCookedBefore, comment, rating } = req.body ?? {};
  const numericRating = Number(rating);
  if (!Number.isInteger(Number(recipeId)) || !(numericRating >= 0 && numericRating <= 5)) {
    return res.status(400).json({ error: "Invalid recipe or rating." });
  }

  try {
    const newEntry = await prisma.diaryEntries.create({
      data: {
        userId: user.id,
        recipeId: Number(recipeId),
        rating: numericRating,
        comment: comment || null,
        date: date ? new Date(date) : new Date(),
        hasCookedBefore: Boolean(hasCookedBefore),
      },
    });
    await revalidateUserPages(res, user.username, [
      "/recipes",
      "/recipes/diary",
      `/wrapped/${newEntry.date.getUTCFullYear()}`,
    ]);
    return res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error logging recipe:", error);
    return res.status(500).json({ error: "Failed to log recipe." });
  }
}
