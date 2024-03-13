import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import StarRating from "../../src/recipe/StarRating";
import { getAllRecipes, getRecipeId } from "../../src/data/recipes";

function RecipePage({ recipe }: { recipe: any }) {
  const title = recipe.name + " by " + recipe.creator + " • Savry";
  const rating: number = recipe.rating / recipe.reviews;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Created with NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container>
        <Grid item xs={1} sx={{ margin: "0 10px 0 10px" }}>
          <Image
            src={recipe.image}
            height="345"
            width="235"
            alt={recipe.name}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h6">{recipe.name}</Typography>
          <Typography variant="body1">
            by{" "}
            <Link href={`/creators/${recipe.creatorId}`}>{recipe.creator}</Link>
          </Typography>

          <Typography variant="body1">{recipe.description}</Typography>
          <StarRating rating={rating} />
          <Typography variant="body1">
            <strong>Ratings:</strong> {rating}/5 Stars based on {recipe.reviews}{" "}
            Reviews
          </Typography>
          <Typography>
            View the <Link href={recipe.link}>Recipe</Link>.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getStaticPaths() {
  const recipes = getAllRecipes();
  const paths = recipes.map((recipe) => ({
    params: { slug: [recipe.name.replace(/\s+/g, "-").toLowerCase()] },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const { slug } = params;

  const recipe = getRecipeId(slug[0].replace(/-/g, " "));
  console.log(slug[0].replace(/-/g, " "));

  if (!recipe) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      recipe,
    },
    revalidate: 1800,
  };
}

export default RecipePage;
