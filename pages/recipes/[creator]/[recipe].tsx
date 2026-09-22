import { Box, Divider, Link as MuiLink, Typography } from "@mui/material";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";

import RecipeActionBar from "@/components/recipes/RecipeActionBar";
import RecipeFriendRatings from "@/components/recipes/RecipeFriendRatings";
import RecipeRatings from "@/components/recipes/RecipeRatings";
import StarRating from "@/components/ui/StarRating";
import { getRecipeBySlug, getRecipeUserState, getReviewsByRecipe } from "@/data/recipes";
import { serialize } from "@/data/serialize";
import { getFollowingList } from "@/data/users";
import type {
  Cooklist,
  Creators,
  DiaryEntries,
  LikedRecipes,
  Recipes,
  Reviews,
  Users,
} from "@/generated/prisma/browser";
import { getSessionFromContext } from "@/lib/auth";

interface Props {
  cooklist: Cooklist[];
  diaryEntries: DiaryEntries[];
  likedRecipes: LikedRecipes[];
  recipe: Recipes & {
    creators: Creators;
    reviews: Reviews[];
  };
  reviews: (Reviews & { users: Users })[];
  sessionUser: any;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RecipePage({
  cooklist,
  diaryEntries,
  likedRecipes,
  recipe,
  reviews,
  sessionUser,
}: Props) {
  const title = `${recipe.name} by ${recipe.creators.name} • Savry`;

  const ratingCount = recipe.reviews.length;
  const averageRating =
    ratingCount > 0
      ? recipe.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / ratingCount
      : 0;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          content={recipe.description ?? `${recipe.name} by ${recipe.creators.name} on Savry`}
          name="description"
        />
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 4, md: 6 },
          pb: 10,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "220px 1fr auto" },
            gap: { xs: 3, sm: 4 },
            mb: 6,
            alignItems: "start",
          }}
        >
          {/* Image */}
          <Box
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.07)",
              aspectRatio: "3/4",
              position: "relative",
              bgcolor: "#161616",
              flexShrink: 0,
            }}
          >
            <Image
              fill
              priority
              alt={recipe.name}
              sizes="220px"
              src={recipe.image}
              style={{ objectFit: "cover" }}
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <MuiLink
              component={NextLink}
              href={`/creators/${recipe.creators.link ?? recipe.creatorId}`}
              sx={{
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "primary.main",
                mb: 1,
                display: "block",
                transition: "color 0.15s",
                "&:hover": { color: "primary.light" },
              }}
              underline="none"
            >
              {recipe.creators.name}
            </MuiLink>

            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: 400,
                lineHeight: 1.2,
                color: "text.primary",
                mb: 2,
              }}
            >
              {recipe.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <StarRating rating={averageRating} size="md" />
              <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                {averageRating > 0 ? averageRating.toFixed(1) : "No ratings yet"}
                {ratingCount > 0 && (
                  <Box component="span" sx={{ color: "#4a4744", ml: 0.75 }}>
                    · {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
                  </Box>
                )}
              </Typography>
            </Box>

            {recipe.description && (
              <Typography
                sx={{
                  fontSize: "0.9375rem",
                  color: "text.secondary",
                  lineHeight: 1.7,
                  mb: 3,
                  maxWidth: "52ch",
                }}
              >
                {recipe.description}
              </Typography>
            )}

            {recipe.link && (
              <MuiLink
                href={recipe.link}
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  fontSize: "0.8125rem",
                  color: "text.secondary",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  px: 1.75,
                  py: 0.75,
                  transition: "border-color 0.15s, color 0.15s",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.22)",
                    color: "text.primary",
                  },
                }}
                target="_blank"
                underline="none"
              >
                View original recipe ↗
              </MuiLink>
            )}

            {reviews.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <RecipeFriendRatings reviews={reviews} />
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: { sm: "140px" },
            }}
          >
            <RecipeActionBar
              cooklist={cooklist}
              diaryEntries={diaryEntries}
              likedRecipes={likedRecipes}
              recipe={recipe}
              sessionUser={sessionUser}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 5 }} />

        <Box sx={{ maxWidth: 480 }}>
          <Typography
            sx={{
              fontSize: "0.625rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#4a4744",
              mb: 2,
            }}
          >
            Rating distribution
          </Typography>
          <RecipeRatings recipe={recipe} />
        </Box>
      </Box>
    </>
  );
}

// ── Data fetching ─────────────────────────────────────────────────────────────

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { creator: creatorSegment, recipe: recipeSegment } = context.params as {
    creator: string;
    recipe: string;
  };

  const [session, recipe] = await Promise.all([
    getSessionFromContext(context),
    getRecipeBySlug(creatorSegment, recipeSegment),
  ]);
  if (!recipe) return { notFound: true };

  if (!session) {
    return {
      props: serialize({
        cooklist: [],
        diaryEntries: [],
        likedRecipes: [],
        recipe,
        reviews: [],
        sessionUser: null,
      }),
    };
  }

  const userId = Number(session.user.id);
  const [userState, following] = await Promise.all([
    getRecipeUserState(userId, recipe.id),
    getFollowingList(userId),
  ]);
  const reviews = await getReviewsByRecipe(recipe.id, following);

  return {
    props: serialize({
      ...userState,
      recipe,
      reviews,
      sessionUser: session.user,
    }),
  };
}
