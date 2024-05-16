import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(5, "Username must be at least 5 characters long.")
    .required("Username is required."),
  password: yup.string().min(5, "Password must be at least 5 characters long."),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    await schema.validate(req.body);

    const { username, password } = req.body;

    const existingUser = await sql`
    SELECT * FROM users WHERE username=${username}`;
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hashedPassword = await hash(password, 10);

    await sql`INSERT INTO users (username, password)
    VALUES (${username}, ${hashedPassword})`;

    res.status(200).json({ message: "Success." });
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return res.status(400).json({ error: e.errors.join(", ") });
    }
    console.log({ e });
    res.status(500).json({ error: "Internal server error." });
  }
}

export default handler;
