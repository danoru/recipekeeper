import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/data/db";
import { requireApiUser, revalidateUserPages } from "@/lib/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  const user = await requireApiUser(req, res);
  if (!user) return;

  const { followingUsername, action } = req.body ?? {};
  if (typeof followingUsername !== "string" || !followingUsername) {
    return res.status(400).json({ error: "Invalid username." });
  }
  if (followingUsername.toLowerCase() === user.username.toLowerCase()) {
    return res.status(400).json({ error: "You cannot follow yourself." });
  }

  try {
    if (action === "follow") {
      await prisma.following.upsert({
        where: { userId_followingUsername: { userId: user.id, followingUsername } },
        update: {},
        create: { userId: user.id, followingUsername },
      });
    } else if (action === "unfollow") {
      await prisma.following.deleteMany({ where: { userId: user.id, followingUsername } });
    } else {
      return res.status(400).json({ error: "Invalid action." });
    }

    await Promise.all([
      revalidateUserPages(res, user.username, ["/following"]),
      revalidateUserPages(res, followingUsername, ["/followers"]),
    ]);
    return res.status(200).json({ message: "Follow status updated." });
  } catch (e) {
    console.error({ e });
    return res.status(500).json({ error: "Failed to update follow status." });
  }
}

export default handler;
