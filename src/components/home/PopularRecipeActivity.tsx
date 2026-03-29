import { memo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Recipes } from "@prisma/client";
import PopularRecipeCard from "../cards/PopularRecipeCard";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  recipes: Recipes[];
}

function PopularRecipeActivity({ recipes }: Props) {
  return (
    <Box sx={{ mb: 5 }}>
      <SectionHeader label="Recipes popular with friends" href="/recipes/popular/week" />
      <Grid container spacing={1.25}>
        {recipes.slice(0, 8).map((recipe, i) => (
          <Grid item xs={6} sm={3} key={`pop-recipe-${i}`}>
            <PopularRecipeCard
              name={recipe.name}
              image={recipe.image}
              link={`/recipes/${recipe.name.replace(/\s+/g, "-").toLowerCase()}`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(PopularRecipeActivity);
