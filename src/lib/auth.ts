import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prisma from "@/data/db";

import { authOptions } from "../../pages/api/auth/[...nextauth]";

/** Reads the session in-process (no HTTP round-trip, unlike `getSession`). */
export function getSessionFromContext(context: Pick<GetServerSidePropsContext, "req" | "res">) {
  return getServerSession(context.req, context.res, authOptions);
}

/**
 * Returns the signed-in user for an API route, or responds 401 and returns null.
 * Always use this id — never trust a `userId` sent in the request body.
 */
export async function requireApiUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const id = Number(session?.user?.id);
  if (!session || !Number.isInteger(id)) {
    res.status(401).json({ error: "You must be signed in." });
    return null;
  }
  return { id, username: session.user.username };
}

/** Best-effort on-demand ISR refresh for a user's static profile pages. */
export async function revalidateUserPages(res: NextApiResponse, username: string, paths: string[]) {
  await Promise.allSettled(paths.map((p) => res.revalidate(`/${username}${p}`)));
}

/**
 * Like requireApiUser, but also requires the ADMIN badge. Checked against the
 * database on every request, so revoking a badge takes effect immediately.
 */
export async function requireApiAdmin(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireApiUser(req, res);
  if (!user) return null;
  const record = await prisma.users.findUnique({
    where: { id: user.id },
    select: { badge: true },
  });
  if (record?.badge !== "ADMIN") {
    res.status(403).json({ error: "Only admins can do that." });
    return null;
  }
  return user;
}
