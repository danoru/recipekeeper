import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

import prisma from "@/data/db";

const schema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters long.")
    .required("Username is required."),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters long.")
    .required("Password is required."),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { username, password } = await schema.validate(req.body);

    const existingUser = await prisma.users.findUnique({
      where: { username },
      select: { id: true },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "Success." });
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return res.status(400).json({ error: e.errors.join(", ") });
    }
    console.error({ e });
    res.status(500).json({ error: "Internal server error." });
  }
}

export default handler;
