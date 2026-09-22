import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import { useState } from "react";

import SocialMeta from "@/components/ui/SocialMeta";
import ProfileLinkBar from "@/components/users/ProfileLinkBar";
import UserAvatar from "@/components/users/UserAvatar";
import { creatorHref, recipeHref } from "@/data/helpers";
import { serialize, type Serialized } from "@/data/serialize";
import { getYearInReview, type YearInReview } from "@/data/stats";
import { siteUrl } from "@/lib/site";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Props = { wrapped: Serialized<YearInReview>; ogImage: string };

export default function WrappedPage({ wrapped, ogImage }: Props) {
  const { user, year } = wrapped;
  const title = `${user.username}'s ${year} in the kitchen • Savry`;
  const [copied, setCopied] = useState(false);

  const share = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <SocialMeta
        description={`${wrapped.totalMeals} meals, ${wrapped.distinctRecipes} recipes. See ${user.username}'s year in the kitchen on Savry.`}
        image={ogImage}
        title={`${user.username}'s ${year} Wrapped`}
      />
      <Head>
        <title>{title}</title>
      </Head>

      <Box
        component="main"
        sx={{ maxWidth: "720px", mx: "auto", px: { xs: 2, sm: 3 }, pt: 4, pb: 12 }}
      >
        <ProfileLinkBar username={user.username} />

        {/* ── Hero ── */}
        <Box sx={{ textAlign: "center", mt: 6, mb: 6 }}>
          <Typography sx={{ ...eyebrow, mb: 2 }}>
            {user.username}&apos;s year in the kitchen
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "4.5rem", sm: "6rem" },
              lineHeight: 1,
              color: "primary.main",
            }}
          >
            {year}
          </Typography>
        </Box>

        {wrapped.totalMeals === 0 ? (
          <Card>
            <Typography sx={{ color: "text.secondary", textAlign: "center" }}>
              Nothing logged in {year} yet. Log a meal and your year will start filling in.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Card>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                  gap: 2,
                }}
              >
                <BigStat label="meals cooked" value={wrapped.totalMeals} />
                <BigStat label="different recipes" value={wrapped.distinctRecipes} />
                <BigStat label="day best streak" value={wrapped.longestStreak} />
                <BigStat
                  label="average rating"
                  value={wrapped.averageRating ? wrapped.averageRating.toFixed(1) : "—"}
                />
              </Box>
            </Card>

            {wrapped.mostCooked && (
              <RecipeCardRow
                caption={`Cooked ${wrapped.mostCooked.times} ${wrapped.mostCooked.times === 1 ? "time" : "times"}`}
                label="Your most-cooked recipe"
                recipe={wrapped.mostCooked.recipe}
              />
            )}

            {wrapped.highestRated && (
              <RecipeCardRow
                caption={`Rated ${wrapped.highestRated.rating} / 5`}
                label="Your highest-rated dish"
                recipe={wrapped.highestRated.recipe}
              />
            )}

            {wrapped.topCreators.length > 0 && (
              <Card>
                <Typography sx={{ ...eyebrow, mb: 2 }}>Creators you cooked the most</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {wrapped.topCreators.map(({ creator, count }, i) => (
                    <Box
                      key={creator.link}
                      component={NextLink}
                      href={creatorHref(creator.link)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <Typography sx={{ ...rank }}>{i + 1}</Typography>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          overflow: "hidden",
                          position: "relative",
                          bgcolor: "#1e1e1e",
                          flexShrink: 0,
                        }}
                      >
                        {creator.image && (
                          <Image
                            fill
                            alt={creator.name}
                            sizes="40px"
                            src={creator.image}
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </Box>
                      <Typography sx={{ flex: 1, fontSize: "0.9375rem" }}>
                        {creator.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                        {count} {count === 1 ? "meal" : "meals"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}

            <Box
              sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}
            >
              {wrapped.busiestMonth && (
                <Card>
                  <Typography sx={{ ...eyebrow, mb: 1 }}>Busiest month</Typography>
                  <Typography sx={{ ...headline }}>{MONTHS[wrapped.busiestMonth.month]}</Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                    {wrapped.busiestMonth.count} meals
                  </Typography>
                </Card>
              )}
              {wrapped.topCuisines.length > 0 && (
                <Card>
                  <Typography sx={{ ...eyebrow, mb: 1 }}>Favorite cuisine</Typography>
                  <Typography sx={{ ...headline }}>{wrapped.topCuisines[0].key}</Typography>
                  {wrapped.topCuisines.length > 1 && (
                    <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                      then{" "}
                      {wrapped.topCuisines
                        .slice(1)
                        .map((c) => c.key)
                        .join(" & ")}
                    </Typography>
                  )}
                </Card>
              )}
            </Box>

            {wrapped.cookedWith.length > 0 && (
              <Card>
                <Typography sx={{ ...eyebrow, mb: 2 }}>Cooking alongside</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {wrapped.cookedWith.map(({ user: friend, sharedRecipes }) => (
                    <Box
                      key={friend.username}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <UserAvatar avatarSize="36px" name={friend.username} />
                      <MuiLink
                        component={NextLink}
                        href={`/${friend.username}`}
                        sx={{ flex: 1, color: "text.primary", fontSize: "0.9375rem" }}
                        underline="none"
                      >
                        {friend.username}
                      </MuiLink>
                      <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                        {sharedRecipes} of the same {sharedRecipes === 1 ? "recipe" : "recipes"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="outlined" onClick={share}>
                {copied ? "Link copied!" : "Share your year"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

// ── Pieces ──────────────────────────────────────────────────────────────────

const eyebrow = {
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#4a4744",
} as const;

const headline = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.75rem",
  lineHeight: 1.2,
} as const;

const rank = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.25rem",
  color: "primary.main",
  width: 20,
  textAlign: "center",
} as const;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: "#161616",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        p: { xs: 2.5, sm: 3 },
      }}
    >
      {children}
    </Box>
  );
}

function BigStat({ label, value }: { label: string; value: number | string }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", lineHeight: 1.1 }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: "0.6875rem", color: "text.disabled" }}>{label}</Typography>
    </Box>
  );
}

function RecipeCardRow({
  label,
  caption,
  recipe,
}: {
  label: string;
  caption: string;
  recipe: { name: string; image: string; creatorId: string; creators: { name: string } };
}) {
  return (
    <Box
      component={NextLink}
      href={recipeHref(recipe.creatorId, recipe.name)}
      sx={{
        display: "flex",
        gap: 2.5,
        alignItems: "center",
        bgcolor: "#161616",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        p: 2,
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.15s",
        "&:hover": { borderColor: "rgba(200,169,110,0.4)" },
      }}
    >
      <Box
        sx={{
          width: { xs: 88, sm: 112 },
          aspectRatio: "1",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          bgcolor: "#1e1e1e",
        }}
      >
        {recipe.image && (
          <Image
            fill
            alt={recipe.name}
            sizes="112px"
            src={recipe.image}
            style={{ objectFit: "cover" }}
          />
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ ...eyebrow, mb: 0.75 }}>{label}</Typography>
        <Typography sx={{ ...headline, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
          {recipe.name}
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
          {recipe.creators.name} · {caption}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { username: string; year: string } }) {
  const year = Number(params.year);
  const currentYear = new Date().getUTCFullYear();
  if (!/^\d{4}$/.test(params.year) || year < 2000 || year > currentYear) {
    return { notFound: true, revalidate: 3600 };
  }

  const wrapped = await getYearInReview(params.username, year);
  if (!wrapped) return { notFound: true, revalidate: 60 };

  return {
    props: {
      wrapped: serialize(wrapped),
      ogImage: `${siteUrl()}/api/og/wrapped/${encodeURIComponent(params.username)}/${year}`,
    },
    revalidate: 3600,
  };
}
