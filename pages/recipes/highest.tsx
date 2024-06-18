import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../src/components/recipes/RecipeList";
import { getRecipesByRating } from "../../src/data/recipes";
import { Recipes } from "@prisma/client";

interface Props {
  recipes: Recipes[];
}

function HighestRatedRecipes({ recipes }: Props) {
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
  let recipes = await getRecipesByRating("highest");

  return {
    props: {
      recipes,
    },
    revalidate: 1800,
  };
}

export default HighestRatedRecipes;
