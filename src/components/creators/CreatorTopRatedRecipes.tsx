import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { recipeHref } from "@/data/helpers";
import type { Recipes } from "@/generated/prisma/browser";

import RecipeCard from "../cards/RecipeCard";

interface Props {
  header: string;
  recipes: Recipes[];
}

function CreatorTopRatedRecipes({ header, recipes }: Props) {
  const styledHeader = header.toUpperCase();
  const typographyStyle = "h6";

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <Grid container>
      <Grid
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          display: "flex",
          justifyContent: "space-between",
          lineHeight: "0",
          margin: "0 auto",
          width: "75%",
        }}
      >
        <Typography component="div" variant={typographyStyle}>
          {styledHeader}
        </Typography>
      </Grid>
      <Grid
        container
        columnSpacing={2}
        rowSpacing={1}
        sx={{
          margin: "10px auto",
          maxWidth: "75%",
        }}
      >
        {recipes.slice(0, 5).map((recipe, i) => {
          return (
            <RecipeCard
              key={`card-${i}`}
              image={recipe.image}
              link={recipeHref(recipe.creatorId, recipe.name)}
              name={recipe.name}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

export default CreatorTopRatedRecipes;
