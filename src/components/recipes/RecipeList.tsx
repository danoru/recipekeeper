import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { recipeHref } from "@/data/helpers";
import type { Recipes } from "@/generated/prisma/browser";

import RecipeCard from "../cards/RecipeCard";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  header: string;
  recipes: Recipes[];
  moreHref?: string;
}

export default function RecipeList({ header, recipes, moreHref }: Props) {
  return (
    <Box>
      <SectionHeader href={moreHref} label={header} />
      <Grid container spacing={1.5}>
        {recipes.map((recipe, i) => (
          <Grid key={`recipe-${i}`} size={{ xs: 6, sm: 4, md: 3 }}>
            <RecipeCard
              image={recipe.image}
              link={recipeHref(recipe.creatorId, recipe.name)}
              name={recipe.name}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
