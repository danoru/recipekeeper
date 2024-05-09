import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import Rating from "@mui/material/Rating";
import RecipeList from "../../../src/components/recipes/RecipeList";
import Typography from "@mui/material/Typography";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { getAllCreators, getCreatorId } from "../../../src/data/creators";
import { getRecipesByCreator } from "../../../src/data/recipes";
import { CREATOR_LIST_TYPE, RECIPE_LIST_TYPE } from "../../../src/types";

interface Props {
  creatorId: CREATOR_LIST_TYPE;
  filteredRecipes: RECIPE_LIST_TYPE[];
}

interface Params {
  params: {
    creatorId: string;
  };
}

function CreatorPage({ creatorId, filteredRecipes }: Props) {
  const title = creatorId.name + " • Savry";
  const header = "All Recipes by Creator";
  const creatorRating = filteredRecipes.reduce(
    (n, { rating }) => n + rating,
    0
  );
  const creatorReview = filteredRecipes.reduce(
    (n, { reviews }) => n + reviews,
    0
  );
  const creatorAverageRating = creatorRating / creatorReview;

  return (
    <Grid container>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid item xs={10}>
        <RecipeList recipes={filteredRecipes} header={header} />
      </Grid>
      <Grid item xs={2}>
        <CreatorCard creatorId={creatorId} rating={creatorAverageRating} />
      </Grid>
    </Grid>
  );
}

function CreatorCard({ creatorId, rating }: any) {
  return (
    <Box>
      <Card
        sx={{
          width: "250px",
        }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={creatorId.image}
          title={creatorId.name}
        />
        <CardContent>
          <Typography variant="h6" component="div">
            {creatorId.name}
          </Typography>
          <Rating value={rating} precision={0.5} readOnly />
          <Link href={creatorId.website}>
            <LinkIcon />
          </Link>
          <Link href={creatorId.instagram}>
            <InstagramIcon />
          </Link>
          <Link href={creatorId.youtube}>
            <YouTubeIcon />
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}

export async function getStaticPaths() {
  const creators = getAllCreators();
  const paths = creators.map((creator) => ({
    params: { creatorId: creator.link },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const creatorId = getCreatorId(params.creatorId);
  const filteredRecipes = getRecipesByCreator(params.creatorId);

  return {
    props: {
      creatorId,
      filteredRecipes,
    },
    revalidate: 1800,
  };
}

export default CreatorPage;
