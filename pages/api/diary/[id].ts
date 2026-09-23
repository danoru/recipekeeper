import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/data/db";
import { requireApiUser, revalidateUserPages } from "@/lib/auth";
import { parseOptionalRating } from "@/lib/rating";

/** Diary pages that show an entry (and Wrapped for each year it touches). */
function affectedPaths(years: number[]) {
  return [
    "/recipes",
    "/recipes/diary",
    "/recipes/reviews",
    ...new Set(years.map((y) => `/wrapped/${y}`)),
  ];
}

/** Edit (PUT) or delete (DELETE) one of your own diary entries. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  const user = await requireApiUser(req, res);
  if (!user) return;

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid entry." });

  // Someone else's entry looks the same as a missing one.
  const entry = await prisma.diaryEntries.findUnique({
    where: { id },
    select: { userId: true, date: true },
  });
  if (!entry || entry.userId !== user.id) {
    return res.status(404).json({ error: "Diary entry not found." });
  }

  try {
    if (req.method === "DELETE") {
      await prisma.diaryEntries.delete({ where: { id } });
      await revalidateUserPages(res, user.username, affectedPaths([entry.date.getUTCFullYear()]));
      return res.status(200).json({ deleted: true });
    }

    const { date, rating, comment, hasCookedBefore } = req.body ?? {};
    const parsedRating = parseOptionalRating(rating);
    const newDate = new Date(date);
    if (!parsedRating.ok) return res.status(400).json({ error: "Ratings go from ½ to 5 stars." });
    if (Number.isNaN(newDate.getTime())) {
      return res.status(400).json({ error: "Please choose a date." });
    }
    if (newDate.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
      return res.status(400).json({ error: "The date can't be in the future." });
    }

    const updated = await prisma.diaryEntries.update({
      where: { id },
      data: {
        date: newDate,
        rating: parsedRating.rating,
        comment:
          typeof comment === "string" && comment.trim() ? comment.trim().slice(0, 5000) : null,
        hasCookedBefore: Boolean(hasCookedBefore),
      },
      select: { id: true, date: true, rating: true, comment: true, hasCookedBefore: true },
    });

    await revalidateUserPages(
      res,
      user.username,
      affectedPaths([entry.date.getUTCFullYear(), newDate.getUTCFullYear()])
    );
    return res.status(200).json({
      ...updated,
      rating: updated.rating?.toNumber() ?? null,
      date: updated.date.toISOString(),
    });
  } catch (error) {
    console.error("[diary entry]", error);
    return res.status(500).json({ error: "Couldn't update the diary entry." });
  }
}
