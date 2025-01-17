import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Creators, DiaryEntries, Recipes } from "@prisma/client";
import Head from "next/head";

import RecipeList from "../../../src/components/recipes/RecipeList";
import { getAllCreators, getCreatorByLink } from "../../../src/data/creators";
import { getRecipesByCreator } from "../../../src/data/recipes";

interface Props {
  creator: Creators;
  recipes: (Recipes & { diaryEntries: DiaryEntries[] })[];
}

interface CardProps {
  creator: Creators;
  rating: number;
  reviewCount: number;
}

interface Params {
  params: {
    creatorId: string;
  };
}

function CreatorPage({ creator, recipes }: Props) {
  const title = creator.name + " • Savry";
  const header = "All Recipes by Creator";

  const diaryEntries = recipes.flatMap((recipe) => recipe.diaryEntries);
  const totalReviews = diaryEntries.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : diaryEntries.reduce(
          (sum, entry) => sum + entry?.rating?.toNumber(),
          0
        ) / totalReviews;

  console.log(diaryEntries);
  return (
    <Grid container>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid item xs={10}>
        <RecipeList recipes={recipes} header={header} />
      </Grid>
      <Grid item xs={2}>
        <CreatorCard
          creator={creator}
          rating={averageRating}
          reviewCount={totalReviews}
        />
      </Grid>
    </Grid>
  );
}

function CreatorCard({ creator, rating, reviewCount }: CardProps) {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
      }}
    >
      <CardMedia
        component="img"
        image={creator.image}
        title={creator.name}
        sx={{
          height: 200,
          filter: "brightness(0.8)",
          transition: "filter 0.3s",
        }}
      />
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          {creator.name}
        </Typography>
        <Rating value={rating} precision={0.5} readOnly />
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginTop: "4px" }}
        >
          {reviewCount} reviews
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "8px" }}
        >
          <IconButton href={creator.website}>
            <LinkIcon />
          </IconButton>
          <IconButton href={creator.instagram}>
            <InstagramIcon />
          </IconButton>
          <IconButton href={creator.youtube}>
            <YouTubeIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export async function getStaticPaths() {
  const creators = await getAllCreators();
  const paths = creators.map((creator) => ({
    params: { creatorId: creator.link },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const creator = await getCreatorByLink(params.creatorId);
  const recipes = await getRecipesByCreator(params.creatorId);

  return {
    props: {
      creator,
      recipes,
    },
    revalidate: 1800,
  };
}

export default CreatorPage;
