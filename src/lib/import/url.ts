// Tracking/share parameters that don't change which page you get.
const TRACKING_PARAMS =
  /^(?:utm_.*|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|igshid|si|ref|ref_src|share|epik|_ga)$/i;

/** Parses an http(s) URL, or returns null. */
export function parseHttpUrl(value: unknown): URL | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/**
 * A stable key for "is this the same recipe page?": https, lowercase host
 * without www, no fragment, no tracking params, sorted query, no trailing slash.
 */
export function canonicalizeUrl(value: string): string | null {
  const url = parseHttpUrl(value);
  if (!url) return null;

  const params = [...url.searchParams.entries()]
    .filter(([key]) => !TRACKING_PARAMS.test(key))
    .sort(([a], [b]) => a.localeCompare(b));
  const query = new URLSearchParams(params).toString();

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const path = url.pathname.replace(/\/+$/, "") || "/";
  return `https://${host}${path === "/" ? "" : path}${query ? `?${query}` : ""}`;
}
