import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";

import prisma from "@/data/db";
import { getUnmatchedIngredients } from "@/data/imports";
import { getSessionFromContext } from "@/lib/auth";

interface Props {
  unmatched: { name: string; count: number }[];
  dictionarySize: number;
  matchedLines: number;
  totalLines: number;
}

/** Admin-only: parsed ingredient names the dictionary doesn't recognize yet. */
export default function UnmatchedIngredientsPage({
  unmatched,
  dictionarySize,
  matchedLines,
  totalLines,
}: Props) {
  const coverage = totalLines ? Math.round((matchedLines / totalLines) * 100) : 0;

  return (
    <>
      <Head>
        <title>Unmatched ingredients • Savry</title>
      </Head>
      <Box
        component="main"
        sx={{ maxWidth: "720px", mx: "auto", px: { xs: 2, sm: 3 }, pt: 5, pb: 12 }}
      >
        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", mb: 1 }}>
          Unmatched ingredients
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}>
          {coverage}% of {totalLines.toLocaleString()} ingredient lines match one of the{" "}
          {dictionarySize} dictionary entries. To teach Savry new ones, add names or aliases to{" "}
          <code>prisma/ingredients-data.ts</code>, run <code>prisma db seed</code>, then{" "}
          <code>pnpm backfill:ingredients --all</code>.
        </Typography>

        {unmatched.length === 0 ? (
          <Typography sx={{ color: "text.disabled" }}>Everything matches. Nice.</Typography>
        ) : (
          <Box
            component="table"
            sx={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
          >
            <thead>
              <tr>
                <Box component="th" sx={th}>
                  Parsed name
                </Box>
                <Box component="th" sx={{ ...th, textAlign: "right" }}>
                  Lines
                </Box>
              </tr>
            </thead>
            <tbody>
              {unmatched.map(({ name, count }) => (
                <tr key={name}>
                  <Box component="td" sx={td}>
                    {name}
                  </Box>
                  <Box component="td" sx={{ ...td, textAlign: "right", color: "text.secondary" }}>
                    {count}
                  </Box>
                </tr>
              ))}
            </tbody>
          </Box>
        )}
      </Box>
    </>
  );
}

const th = {
  textAlign: "left",
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#4a4744",
  pb: 1,
  borderBottom: "1px solid rgba(255,255,255,0.07)",
} as const;

const td = { py: 1, borderBottom: "1px solid rgba(255,255,255,0.05)" } as const;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionFromContext(context);
  const user = session
    ? await prisma.users.findUnique({
        where: { id: Number(session.user.id) },
        select: { badge: true },
      })
    : null;
  if (user?.badge !== "ADMIN") return { notFound: true };

  const [unmatched, dictionarySize, matchedLines, totalLines] = await Promise.all([
    getUnmatchedIngredients(),
    prisma.ingredient.count(),
    prisma.recipeIngredient.count({ where: { ingredientId: { not: null } } }),
    prisma.recipeIngredient.count(),
  ]);

  return { props: { unmatched, dictionarySize, matchedLines, totalLines } satisfies Props };
}
