import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/data/db";
import { requireApiAdmin } from "@/lib/auth";
import { parseHttpUrl } from "@/lib/import/url";

const URL_FIELDS = ["image", "website", "instagram", "youtube"] as const;

/** Admin-only: edit a creator's name, photo, links, and whether they're featured. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  const admin = await requireApiAdmin(req, res);
  if (!admin) return;

  const link = String(req.query.link);
  const creator = await prisma.creators.findUnique({ where: { link }, select: { link: true } });
  if (!creator) return res.status(404).json({ error: "Creator not found." });

  const body = req.body ?? {};
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
  if (!name) return res.status(400).json({ error: "Name is required." });

  const data: Record<string, string | boolean> = { name };
  if (typeof body.featured === "boolean") data.featured = body.featured;
  for (const field of URL_FIELDS) {
    const raw = typeof body[field] === "string" ? body[field].trim() : "";
    if (!raw) {
      data[field] = "";
      continue;
    }
    const url = parseHttpUrl(raw);
    if (!url) return res.status(400).json({ error: `${field} must be an http(s) link.` });
    data[field] = url.toString();
  }

  try {
    const updated = await prisma.creators.update({ where: { link }, data });
    // /creators is rendered per request, so only the creator's own page needs refreshing.
    await res.revalidate(`/creators/${link}`).catch(() => {});
    return res.status(200).json(updated);
  } catch (error) {
    console.error("[creator update]", error);
    return res.status(500).json({ error: "Couldn't update the creator." });
  }
}
