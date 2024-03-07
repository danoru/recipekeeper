import Grid from "@mui/material/Grid";
import Head from "next/head";

import RecipeList from "../../src/components/recipes/RecipeList";

import { getAllRecipes } from "../../src/data/recipes";

function AllRecipes(props: any) {
  const { recipes } = props;

  return (
    <div>
      <Head>
        <title>All Recipes • Savry</title>
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
  let recipes = getAllRecipes();

  return {
    props: {
      recipes,
    },
    revalidate: 1800,
  };
}

export default AllRecipes;
