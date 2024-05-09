import Grid from "@mui/material/Grid";
import Head from "next/head";

import RecipeList from "../../src/components/recipes/RecipeList";
import { getRecipesByRating } from "../../src/data/recipes";

function HighestRatedRecipes({ recipes }: any) {
  const header = "RECIPES";

  return (
    <div>
      <Head>
        <title>Highest Rated Recipes • Savry</title>
      </Head>
      <main>
        <Grid container>
          <RecipeList recipes={recipes} header={header} />
        </Grid>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  let recipes = getRecipesByRating("highest");

  return {
    props: {
      recipes,
    },
    revalidate: 1800,
  };
}

export default HighestRatedRecipes;
