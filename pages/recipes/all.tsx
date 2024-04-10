import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../src/components/recipes/RecipeList";
import { RECIPE_LIST_TYPE } from "../../src/types";

interface Props {
  recipes: RECIPE_LIST_TYPE[];
}

function AllRecipes(props: Props) {
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

export async function getServerSideProps() {
  const { DEV_URL, PROD_URL } = process.env;
  const dev = process.env.NODE_ENV !== "production" ? DEV_URL : PROD_URL;
  const res = await fetch(`${dev}/api/recipes`);
  const recipes = await res.json();

  return {
    props: {
      recipes,
    },
  };
}

export default AllRecipes;
