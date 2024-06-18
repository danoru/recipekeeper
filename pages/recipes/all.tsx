import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../src/components/recipes/RecipeList";
import { Recipes } from "@prisma/client";
import { getAllRecipes } from "../../src/data/recipes";

interface Props {
  recipes: Recipes[];
}

function AllRecipes({ recipes }: Props) {
  const header = "RECIPES";

  return (
    <div>
      <Head>
        <title>All Recipes • Savry</title>
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
  const recipes = await getAllRecipes();
  return {
    props: {
      recipes,
    },
  };
}

export default AllRecipes;
