import Grid from "@mui/material/Grid";
import Head from "next/head";

import RecipeList from "../../src/components/recipes/RecipeList";
import { getRecipesByRating } from "../../src/data/recipes";

function LowestRatedRecipes(props: any) {
  const { recipes } = props;

  return (
    <div>
      <Head>
        <title>Lowest Rated Recipes • Savry</title>
      </Head>
      <main>
        <Grid container>
          <RecipeList recipes={recipes} />
        </Grid>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  let recipes = getRecipesByRating("lowest");

  return {
    props: {
      recipes,
    },
    revalidate: 1800,
  };
}

export default LowestRatedRecipes;
