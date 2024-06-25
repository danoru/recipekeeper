import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, followingUsername, action } = req.body;

  try {
    if (action === "follow") {
      await prisma.following.create({
        data: {
          userId,
          followingUsername,
        },
      });
    } else if (action === "unfollow") {
      await prisma.following.delete({
        where: {
          userId_followingUsername: {
            userId,
            followingUsername,
          },
        },
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update follow status." });
  }
}

export default handler;
