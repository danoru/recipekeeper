import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/data/db";
import { requireApiUser, revalidateUserPages } from "@/lib/auth";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.setHeader("Allow", ["POST", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  }

  const user = await requireApiUser(req, res);
  if (!user) return;

  const recipeId = Number(req.body?.recipeId);
  if (!Number.isInteger(recipeId)) return res.status(400).json({ error: "Invalid recipeId." });

  try {
    if (req.method === "POST") {
      await prisma.cooklist.upsert({
        where: { userId_recipeId: { userId: user.id, recipeId } },
        update: {},
        create: { userId: user.id, recipeId },
      });
    } else {
      await prisma.cooklist.deleteMany({ where: { userId: user.id, recipeId } });
    }
    await revalidateUserPages(res, user.username, ["/cooklist"]);
    return res.status(200).json({ message: "Cooklist updated." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update cooklist." });
  }
}
