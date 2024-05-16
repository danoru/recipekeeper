import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hash(password, 10);
    const response = await sql`INSERT INTO users (username, password)
    VALUES (${username}, ${hashedPassword})`;
    // validate username and password
    console.log({ username, password });
    res.status(200).json({ message: "Success." });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ error: "Internal server error." });
  }
}

export default handler;
