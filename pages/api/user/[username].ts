import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { sql } from "@vercel/postgres";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  const { username } = req.query;

  if (typeof username !== "string") {
    return res.status(400).json({ message: "Invalid username." });
  }

  if (req.method === "GET") {
    try {
      const result = await sql`
        SELECT * FROM users WHERE username = ${username}`;
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
    // } else if (req.method === "PUT") {
    //   const { firstName, lastName, email, location, website, bio } = req.body;

    //   try {
    //     const result =
    //       await sql`UPDATE users SET first_name = $1, last_name = $2, email = $3, location = $4, website = $5, bio = $6 WHERE username = $7 RETURNING *`;
    //     // (firstName, lastName, email, location, website, bio, username)
    //     return res.status(200).json(result.rows[0]);
    //   } catch (error) {
    //     return res.status(500).json({ message: "Internal Server Error" });
    //   }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}

export default handler;
