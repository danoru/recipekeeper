import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "next/link";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import YouTubeIcon from "@mui/icons-material/YouTube";

import CreatorRecipeList from "../../../src/components/creators/CreatorRecipeList";
import StarRating from "../../../src/review/StarRating";
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

function CreatorPage(props: Props) {
  const { creatorId, filteredRecipes } = props;
  const title = creatorId.name + " • Savry";
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
        <CreatorRecipeList filteredRecipes={filteredRecipes} />
      </Grid>
      <Grid item xs={2}>
        <CreatorCard creatorId={creatorId} rating={creatorAverageRating} />
      </Grid>
    </Grid>
  );
}

function CreatorCard(props: any) {
  const { creatorId, rating } = props;

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
          <StarRating rating={rating} />
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
