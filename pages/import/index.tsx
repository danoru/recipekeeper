import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import ImportRecipeModal from "@/components/modals/ImportRecipeModal";
import { getSessionFromContext } from "@/lib/auth";
import type { PageData } from "@/lib/import/jsonld";

interface Props {
  /** URL from the share target (?url= or a URL inside ?text=). */
  sharedUrl: string | null;
  fromBookmarklet: boolean;
}

/**
 * The bookmarklet: collects the current page's JSON-LD + Open Graph tags in
 * the user's browser (which works even on sites that block server fetches),
 * opens Savry, and hands the data over with postMessage. The URL is also in
 * the query string as a fallback if the handoff fails.
 */
function bookmarkletSource(origin: string) {
  const code = `(()=>{const o=${JSON.stringify(origin)};const m=p=>document.querySelector('meta[property="'+p+'"]')?.content||null;const d={url:location.href,jsonLd:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent),ogSiteName:m('og:site_name'),ogImage:m('og:image')};const w=window.open(o+'/import?from=bookmarklet&url='+encodeURIComponent(location.href),'savry-import');if(!w){alert('Please allow pop-ups to save to Savry.');return}const h=e=>{if(e.origin===o&&e.data==='savry:ready'){w.postMessage({type:'savry:page',page:d},o);removeEventListener('message',h)}};addEventListener('message',h)})()`;
  return `javascript:${encodeURIComponent(code)}`;
}

export default function ImportPage({ sharedUrl, fromBookmarklet }: Props) {
  const router = useRouter();
  const [page, setPage] = useState<PageData | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(fromBookmarklet ? null : sharedUrl);
  const bookmarkletRef = useRef<HTMLAnchorElement>(null);

  // React blocks `javascript:` hrefs in JSX, so set the bookmarklet link directly.
  useEffect(() => {
    bookmarkletRef.current?.setAttribute("href", bookmarkletSource(window.location.origin));
  }, []);

  // Bookmarklet handoff: announce we're ready, then accept the page data.
  useEffect(() => {
    if (!fromBookmarklet) return;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.opener) return;
      const data = event.data as { type?: string; page?: PageData };
      if (data?.type === "savry:page" && data.page) setPage(data.page);
    };
    window.addEventListener("message", onMessage);
    // The opener is the recipe site, whose origin we can't know in advance.
    // The message carries no data, and anything sent back is validated server-side.
    window.opener?.postMessage("savry:ready", "*");

    // If the handoff doesn't arrive (e.g. the site cut the window link), fetch the URL instead.
    const timer = setTimeout(() => setFallbackUrl((current) => current ?? sharedUrl), 2000);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
    };
  }, [fromBookmarklet, sharedUrl]);

  const waiting = fromBookmarklet && !page && !fallbackUrl;
  const modalKey = page ? `page:${page.url}` : `url:${fallbackUrl ?? ""}`;

  return (
    <>
      <Head>
        <title>Import a recipe • Savry</title>
      </Head>

      <Box
        component="main"
        sx={{ maxWidth: "720px", mx: "auto", px: { xs: 2, sm: 3 }, pt: 5, pb: 12 }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "1.75rem", sm: "2.25rem" },
            mb: 1,
          }}
        >
          Import a recipe
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}>
          Save recipes from almost any cooking site. Paste a link, or use one of the shortcuts below
          to save straight from the page you&apos;re reading.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <Box sx={card}>
            <Typography sx={eyebrow}>On a computer</Typography>
            <Typography
              sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 2, lineHeight: 1.6 }}
            >
              Drag this button to your bookmarks bar. On any recipe page, click it to send the
              recipe to Savry.
            </Typography>
            <Box
              ref={bookmarkletRef}
              component="a"
              href="#"
              sx={{
                display: "inline-block",
                px: 2,
                py: 1,
                borderRadius: "8px",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: "0.8125rem",
                fontWeight: 500,
                textDecoration: "none",
                cursor: "grab",
              }}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                alert("Drag this button to your bookmarks bar, then click it on a recipe page.");
              }}
            >
              Save to Savry
            </Box>
            <Typography sx={{ fontSize: "0.75rem", color: "text.disabled", mt: 1.5 }}>
              Also works on iPhone and iPad: bookmark any page, then edit the bookmark and paste
              this button&apos;s address (long-press it → Copy Link).
            </Typography>
          </Box>

          <Box sx={card}>
            <Typography sx={eyebrow}>On Android</Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", lineHeight: 1.6 }}>
              Install Savry from your browser menu (&ldquo;Add to Home screen&rdquo;). Then use{" "}
              <strong>Share → Savry</strong> from any recipe page or app.
            </Typography>
          </Box>
        </Box>

        {waiting && (
          <Typography sx={{ color: "text.secondary", mt: 4, textAlign: "center" }}>
            Getting the recipe from the page…
          </Typography>
        )}
      </Box>

      {!waiting && (
        <ImportRecipeModal
          key={modalKey}
          isOpen
          initialPage={page ?? undefined}
          initialUrl={page ? undefined : (fallbackUrl ?? undefined)}
          onClose={() => router.push("/recipes")}
        />
      )}
    </>
  );
}

const card = {
  bgcolor: "#161616",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "12px",
  p: 2.5,
} as const;

const eyebrow = {
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#4a4744",
  mb: 1,
} as const;

/** Share targets often put the link in `text` ("Check this out https://…"). */
function findSharedUrl(query: GetServerSidePropsContext["query"]): string | null {
  for (const key of ["url", "text", "title"]) {
    const value = query[key];
    if (typeof value !== "string") continue;
    const match = value.match(/https?:\/\/\S+/);
    if (match) return match[0];
  }
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionFromContext(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      sharedUrl: findSharedUrl(context.query),
      fromBookmarklet: context.query.from === "bookmarklet",
    } satisfies Props,
  };
}
