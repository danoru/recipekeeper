/** @jsxImportSource react */
// Share cards render outside the MUI/Emotion tree, so use the plain React JSX runtime.
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";

// Shared pieces for the /api/og/* share-card route handlers (1200×630).

export const OG_SIZE = { width: 1200, height: 630 };

const GOLD = "#c8a96e";
const INK = "#f0ede6";
const MUTED = "#888580";
const BG = "#0e0e0e";

const fontCache = new Map<string, Promise<ArrayBuffer | null>>();

/**
 * A Google Font as TTF, cached per server instance. Requesting the CSS without
 * a modern user agent returns a TTF URL, which Satori needs (not WOFF2).
 */
function loadGoogleFont(family: string): Promise<ArrayBuffer | null> {
  const cached = fontCache.get(family);
  if (cached) return cached;

  const font = (async () => {
    try {
      const css = await fetch(
        `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@400`,
        { signal: AbortSignal.timeout(5000) }
      ).then((r) => r.text());
      const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
      if (!url) throw new Error(`No TTF for ${family}`);
      return await fetch(url, { signal: AbortSignal.timeout(5000) }).then((r) => r.arrayBuffer());
    } catch {
      fontCache.delete(family); // retry on the next request
      return null;
    }
  })();
  fontCache.set(family, font);
  return font;
}

/**
 * Fetches a remote image as a data URL, or null. Satori can't decode every
 * format (e.g. WebP), so only JPEG/PNG are embedded; anything else is skipped
 * instead of failing the whole card.
 */
export async function imageDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const type = res.headers.get("content-type")?.split(";")[0] ?? "";
    if (!res.ok || !["image/jpeg", "image/png"].includes(type)) return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length > 4_000_000) return null;
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderCard(content: ReactNode) {
  const [sans, serif] = await Promise.all([
    loadGoogleFont("DM Sans"),
    loadGoogleFont("Playfair Display"),
  ]);
  // Text defaults to "Sans" (set on the root); elements opt into "Serif".
  const fonts = [
    sans && { name: "Sans", data: sans, weight: 400 as const, style: "normal" as const },
    serif && { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
  ].filter((f) => !!f);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BG,
        fontFamily: "Sans",
        color: INK,
        padding: 64,
      }}
    >
      <div style={{ display: "flex", flex: 1 }}>{content}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 24,
          fontSize: 24,
          color: MUTED,
        }}
      >
        <span style={{ fontFamily: "Serif", fontSize: 34, color: INK }}>Savry</span>
        <span>Track the recipes you cook</span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: fonts.length ? fonts : undefined,
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    }
  );
}

export const og = { GOLD, INK, MUTED };
