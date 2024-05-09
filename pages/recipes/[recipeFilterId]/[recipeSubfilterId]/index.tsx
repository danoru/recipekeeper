import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../../../src/components/recipes/RecipeList";
import { RECIPE_LIST, getFilteredRecipes } from "../../../../src/data/recipes";
import { RECIPE_LIST_TYPE } from "../../../../src/types";

interface Props {
  recipes: RECIPE_LIST_TYPE[];
  recipeSubfilterId: string;
}

interface Params {
  recipeFilterId: string;
  recipeSubfilterId: string;
}

function FilterRecipePage({ recipes, recipeSubfilterId }: Props) {
  const caseCorrectedSubfilter = recipeSubfilterId.replace(
    /\b\w/g,
    (match: string) => match.toUpperCase()
  );

  const title = `${caseCorrectedSubfilter} Recipes • Savry`;
  const header = "RECIPES";

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <RecipeList recipes={recipes} header={header} />
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

export async function getStaticProps({
  recipeFilterId,
  recipeSubfilterId,
}: Params) {
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
