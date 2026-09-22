/** Absolute site origin, for share-card URLs that crawlers fetch. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}
