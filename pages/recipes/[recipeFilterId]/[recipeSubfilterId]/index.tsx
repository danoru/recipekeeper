import Grid from "@mui/material/Grid";
import Head from "next/head";

import RecipeList from "../../../../src/components/recipes/RecipeList";

import { RECIPE_LIST, getFilteredRecipes } from "../../../../src/data/recipes";

function FilterRecipePage(props: any) {
  const { recipes, recipeSubfilterId } = props;
  const caseCorrectedSubfilter = recipeSubfilterId.replace(
    /\b\w/g,
    (match: string) => match.toUpperCase()
  );

  const title = `${caseCorrectedSubfilter} Recipes • Savry`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <RecipeList recipes={recipes} />
      </Grid>
    </div>
  );
}

export async function getStaticPaths() {
  const paths: any = [];
  const uniqueFilters = ["category", "cuisine", "course", "method", "diet"];

  for (const filter of uniqueFilters) {
    const uniqueValues = [
      ...new Set(RECIPE_LIST.map((recipe: any) => recipe[filter])),
    ];
    uniqueValues.forEach((value) => {
      paths.push({
        params: {
          recipeFilterId: filter,
          recipeSubfilterId: value.replace(/\s/g, "").toLowerCase(),
        },
      });
    });
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const { recipeFilterId, recipeSubfilterId } = params;

  const recipes = getFilteredRecipes(recipeFilterId, recipeSubfilterId);

  return {
    props: {
      recipes,
      recipeSubfilterId,
    },
    revalidate: 1800,
  };
}

export default FilterRecipePage;
