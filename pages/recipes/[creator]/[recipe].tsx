import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Head from "next/head";
import Image from "next/image";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import RecipeActionBar from "../../../src/components/recipes/RecipeActionBar";
import RecipeFriendRatings from "../../../src/components/recipes/RecipeFriendRatings";
import RecipeRatings from "../../../src/components/recipes/RecipeRatings";
import StarRating from "../../../src/components/ui/StarRating";
import Typography from "@mui/material/Typography";
import { serializePrisma } from "../../../src/data/helpers";
import { findUserByUsername, getFollowingList } from "../../../src/data/users";
import {
  getCooklist,
  getLikedRecipes,
  getRecipeBySlug,
} from "../../../src/data/recipes";
import { getReviewsByRecipe } from "../../../src/data/reviews";
import { getSession } from "next-auth/react";
import { getUserDiaryEntries } from "../../../src/data/diary";
import type {
  Cooklist,
  Creators,
  DiaryEntries,
  LikedRecipes,
  Recipes,
  Reviews,
  Users,
} from "@prisma/client";
import type { SReviewWithUser } from "../../../src/types/serialized";
import type { SUser } from "../../../src/types/serialized";

// ── Types ────────────────────────────────────────────────────────────────────

// After serializePrisma, Decimals become numbers and Dates become strings
type SerializedReview = Omit<Reviews, "rating" | "date"> & {
  rating: number;
  date: string;
};
type SerializedDiaryEntry = Omit<DiaryEntries, "rating" | "date"> & {
  rating: number;
  date: string;
};

interface Props {
  cooklist: Cooklist[];
  diaryEntries: SerializedDiaryEntry[];
  likedRecipes: LikedRecipes[];
  recipe: Omit<Recipes, "rating"> & {
    creators: Creators;
    reviews: SerializedReview[];
    averageRating?: number;
  };
  reviews: (SerializedReview & { users: SUser })[];
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
      ? recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
      : 0;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={
            recipe.description ??
            `${recipe.name} by ${recipe.creators.name} on Savry`
          }
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
        {/* ── TOP: image + meta + actions ── */}
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
              src={recipe.image}
              alt={recipe.name}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="220px"
            />
          </Box>

          {/* Meta */}
          <Box sx={{ minWidth: 0 }}>
            <MuiLink
              component={NextLink}
              href={`/creators/${recipe.creators.link ?? recipe.creatorId}`}
              underline="none"
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

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
            >
              <StarRating rating={averageRating} size="md" />
              <Typography
                sx={{ fontSize: "0.8125rem", color: "text.secondary" }}
              >
                {averageRating > 0
                  ? averageRating.toFixed(1)
                  : "No ratings yet"}
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
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
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

export async function getServerSideProps(context: {
  params: { creator: string; recipe: string };
  req: any;
}) {
  const { creator: creatorSlug, recipe: recipeSlug } = context.params;
  const session = await getSession({ req: context.req });

  // Fetch recipe by creator slug + recipe slug (handles duplicate names)
  const recipe = await getRecipeBySlug(creatorSlug, recipeSlug);
  if (!recipe) return { notFound: true };

  if (session) {
    const sessionUser = session.user;
    const user = await findUserByUsername(sessionUser.username);

    if (user) {
      const [cooklist, diaryEntries, following, likedRecipes] =
        await Promise.all([
          getCooklist(user.id),
          getUserDiaryEntries(user.id),
          getFollowingList(user.id),
          getLikedRecipes(user.id),
        ]);

      const reviews = await getReviewsByRecipe(recipe.id, following);

      return {
        props: serializePrisma({
          cooklist,
          diaryEntries,
          following,
          likedRecipes,
          recipe,
          reviews,
          sessionUser,
        }),
      };
    }
  }

  return {
    props: serializePrisma({
      cooklist: [],
      diaryEntries: [],
      likedRecipes: [],
      recipe,
      reviews: [],
      sessionUser: null,
    }),
  };
}
