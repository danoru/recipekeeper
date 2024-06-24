import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Image from "next/image";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import Rating from "@mui/material/Rating";
import RecipeList from "../../../src/components/recipes/RecipeList";
import Typography from "@mui/material/Typography";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { getAllCreators, getCreatorByLink } from "../../../src/data/creators";
import { getRecipesByCreator } from "../../../src/data/recipes";
import { Creators, Recipes, Reviews } from "@prisma/client";

interface Props {
  creator: Creators;
  recipes: (Recipes & { reviews: Reviews })[];
}

interface Params {
  params: {
    creatorId: string;
  };
}

function CreatorPage({ creator, recipes }: Props) {
  const title = creator.name + " • Savry";
  const header = "All Recipes by Creator";

  const reviews = recipes.flatMap((recipe) => recipe.reviews);

  const rating = reviews.reduce(
    (sum, review) => sum + review.rating.toNumber(),
    0
  );

  return (
    <Grid container>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid item xs={10}>
        <RecipeList recipes={recipes} header={header} />
      </Grid>
      <Grid item xs={2}>
        <CreatorCard creator={creator} rating={rating} />
      </Grid>
    </Grid>
  );
}

function CreatorCard({ creator, rating }: any) {
  return (
    <Box>
      <Card
        sx={{
          width: "250px",
        }}
      >
        <CardMedia style={{ position: "relative", height: 140 }}>
          <Image
            src={creator.image}
            alt={creator.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="h6" component="div">
            {creator.name}
          </Typography>
          <Rating value={rating} precision={0.5} readOnly />
          <Link href={creator.website}>
            <LinkIcon />
          </Link>
          <Link href={creator.instagram}>
            <InstagramIcon />
          </Link>
          <Link href={creator.youtube}>
            <YouTubeIcon />
          </Link>
        </CardContent>
      </Card>
    </Box>
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
