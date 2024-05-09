import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../src/components/recipes/RecipeList";
import { getRecipesByRating } from "../../src/data/recipes";
import { RECIPE_LIST_TYPE } from "../../src/types";

interface Props {
  recipes: RECIPE_LIST_TYPE[];
}

function LowestRatedRecipes({ recipes }: Props) {
  const header = "RECIPES";

  return (
    <div>
      <Head>
        <title>Lowest Rated Recipes • Savry</title>
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
  let recipes = getRecipesByRating("lowest");

  return {
    props: {
      recipes,
    },
    revalidate: 1800,
  };
}

export default LowestRatedRecipes;
