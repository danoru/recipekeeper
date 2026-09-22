/** @jsxImportSource react */
// Share cards render outside the MUI/Emotion tree, so use the plain React JSX runtime.
import { ImageResponse } from "next/og";

import { loadGoogleFont, og } from "@/lib/og";

const SIZES = new Set([180, 192, 512]);

/** App icon for the PWA manifest and iOS home screen: a gold serif "S". */
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const size = Number((await params).size);
  if (!SIZES.has(size)) return new Response("Not found", { status: 404 });

  const serif = await loadGoogleFont("Playfair Display");
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e0e0e",
        color: og.GOLD,
        fontFamily: "Serif",
        fontSize: size * 0.62,
        paddingBottom: size * 0.06,
      }}
    >
      S
    </div>,
    {
      width: size,
      height: size,
      fonts: serif ? [{ name: "Serif", data: serif, weight: 400, style: "normal" }] : undefined,
      headers: { "Cache-Control": "public, max-age=604800, immutable" },
    }
  );
}
