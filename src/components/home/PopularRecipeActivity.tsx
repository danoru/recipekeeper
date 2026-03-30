import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Recipes } from "@prisma/client";
import { memo } from "react";

import PopularRecipeCard from "../cards/PopularRecipeCard";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  recipes: Recipes[];
}

function PopularRecipeActivity({ recipes }: Props) {
  return (
    <Box sx={{ mb: 5 }}>
      <SectionHeader href="/recipes/popular/week" label="Recipes popular with friends" />
      <Grid container spacing={1.25}>
        {recipes.slice(0, 8).map((recipe, i) => (
          <Grid key={`pop-recipe-${i}`} size={{ sm: 3, xs: 6 }}>
            <PopularRecipeCard
              image={recipe.image}
              link={`/recipes/${recipe.name.replace(/\s+/g, "-").toLowerCase()}`}
              name={recipe.name}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(PopularRecipeActivity);
