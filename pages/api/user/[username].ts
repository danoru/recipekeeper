import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/data/db";
import { getOwnSettings } from "@/data/users";
import { requireApiUser } from "@/lib/auth";

const EDITABLE_FIELDS = ["firstName", "lastName", "email", "location", "website", "bio"] as const;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "PUT") {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  }

  const user = await requireApiUser(req, res);
  if (!user) return;

  // This endpoint only serves the signed-in user's own settings.
  if (String(req.query.username).toLowerCase() !== user.username.toLowerCase()) {
    return res.status(403).json({ error: "Forbidden." });
  }

  try {
    if (req.method === "GET") {
      return res.status(200).json(await getOwnSettings(user.id));
    }

    const data: Partial<Record<(typeof EDITABLE_FIELDS)[number], string | null>> = {};
    for (const field of EDITABLE_FIELDS) {
      const value = req.body?.[field];
      if (typeof value === "string") data[field] = value.trim() || null;
    }

    await prisma.users.update({ where: { id: user.id }, data });
    return res.status(200).json(await getOwnSettings(user.id));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user data." });
  }
}

export default handler;
