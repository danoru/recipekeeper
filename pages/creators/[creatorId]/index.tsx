import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import MuiLink from "@mui/material/Link";
import RecipeList from "../../../src/components/recipes/RecipeList";
import StarRating from "../../../src/components/ui/StarRating";
import Typography from "@mui/material/Typography";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  getAllCreators,
  getCreatorByLink,
  getTopRatedRecipesByCreator,
} from "../../../src/data/creators";
import { getRecipesByCreator } from "../../../src/data/recipes";
import { recipeHref, serializePrisma } from "../../../src/data/helpers";

interface SerializedCreator {
  name: string;
  link: string;
  image: string;
  website: string | null;
  instagram: string | null;
  youtube: string | null;
  [key: string]: any;
}

interface SerializedRecipe {
  id: number;
  name: string;
  image: string;
  [key: string]: any;
}

interface SerializedDiaryEntry {
  rating: number;
  [key: string]: any;
}

interface SerializedRecipeWithDiary extends SerializedRecipe {
  diaryEntries: SerializedDiaryEntry[];
}

interface Props {
  creator: SerializedCreator;
  recipes: SerializedRecipeWithDiary[];
  topRatedRecipes: SerializedRecipe[] | null;
}

export default function CreatorPage({
  creator,
  recipes,
  topRatedRecipes,
}: Props) {
  const title = `${creator.name} • Savry`;

  const allEntries = recipes.flatMap((r) => r.diaryEntries);
  const totalReviews = allEntries.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : allEntries.reduce((sum, e) => sum + e.rating, 0) / totalReviews;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 4, md: 6 },
          pb: 10,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 220px" },
          gap: 5,
          alignItems: "start",
        }}
      >
        {/* ── Main content ── */}
        <Box sx={{ minWidth: 0 }}>
          {/* Top rated */}
          {topRatedRecipes && topRatedRecipes.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#4a4744",
                  mb: 2,
                  pb: 1.5,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                Top rated by {creator.name}
              </Typography>
              <Grid container spacing={1.5}>
                {topRatedRecipes.slice(0, 5).map((recipe, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Box
                      component={MuiLink}
                      href={recipeHref(creator.name, recipe.name)}
                      sx={{
                        position: "relative",
                        display: "block",
                        borderRadius: "10px",
                        overflow: "hidden",
                        aspectRatio: "3/4",
                        border: "1px solid rgba(200,169,110,0.2)",
                        textDecoration: "none",
                        bgcolor: "#161616",
                        transition: "border-color 0.2s, transform 0.2s",
                        "&:hover": {
                          borderColor: "rgba(200,169,110,0.5)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${recipe.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)",
                          display: "flex",
                          alignItems: "flex-end",
                          p: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "0.875rem",
                            color: "#fff",
                            lineHeight: 1.3,
                          }}
                        >
                          {recipe.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ mb: 5 }} />

          {/* All recipes */}
          <RecipeList
            header={`All recipes by ${creator.name}`}
            recipes={recipes}
          />
        </Box>

        {/* ── Sidebar: creator card ── */}
        <Box
          sx={{
            position: { md: "sticky" },
            top: { md: "72px" },
            bgcolor: "#161616",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Creator image */}
          <Box sx={{ position: "relative", aspectRatio: "1", width: "100%" }}>
            <Image
              src={creator.image}
              alt={creator.name}
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              sizes="220px"
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
              }}
            />
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.125rem",
                color: "text.primary",
                mb: 0.75,
              }}
            >
              {creator.name}
            </Typography>

            {totalReviews > 0 && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <StarRating rating={averageRating} size="sm" />
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.disabled" }}
                >
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Social links */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {creator.website && (
                <IconButton
                  href={creator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: "text.disabled",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <LanguageIcon fontSize="small" />
                </IconButton>
              )}
              {creator.instagram && (
                <IconButton
                  href={creator.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: "text.disabled",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
              )}
              {creator.youtube && (
                <IconButton
                  href={creator.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: "text.disabled",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <YouTubeIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const creators = await getAllCreators();
  return {
    paths: creators.map((c) => ({ params: { creatorId: c.link } })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { creatorId: string };
}) {
  const [creator, recipes, topRatedRecipes] = await Promise.all([
    getCreatorByLink(params.creatorId),
    getRecipesByCreator(params.creatorId),
    getTopRatedRecipesByCreator(params.creatorId),
  ]);

  if (!creator) return { notFound: true };

  return {
    props: serializePrisma({ creator, recipes, topRatedRecipes }),
    revalidate: 1800,
  };
}
