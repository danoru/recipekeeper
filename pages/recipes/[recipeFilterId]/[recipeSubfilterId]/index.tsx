import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../../../src/components/recipes/RecipeList";
import { getFilteredRecipes } from "../../../../src/data/recipes";
import { PrismaClient, Recipes } from "@prisma/client";

interface Props {
  recipes: Recipes[];
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
  const prisma = new PrismaClient();
  const paths: any = [];
  const uniqueFilters = ["category", "cuisine", "course", "method", "diet"];

  for (const filter of uniqueFilters) {
    const uniqueValues = await prisma.recipes.findMany({
      distinct: [filter],
      select: {[filter]: true}
    }),
  });
  uniqueValues.forEach((value) => {
    const filterValue = value[filter];
    if (filterValue) {
        paths.push({
          params: {
            recipeFilterId: filter,
            recipeSubfilterId: filterValue.replace(/\s/g, "").toLowerCase(),
          },
        });
      }
    });
  }
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: Params }) {
  const { recipeFilterId, recipeSubfilterId } = params;
  const recipes = await getFilteredRecipes(recipeFilterId, recipeSubfilterId);

  return {
    props: {
      recipes,
      recipeSubfilterId,
    },
    revalidate: 1800,
  };
}

export default FilterRecipePage;
