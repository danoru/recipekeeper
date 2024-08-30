import Grid from "@mui/material/Grid";
import RecipeCard from "../cards/RecipeCard";
import Typography from "@mui/material/Typography";
import { Recipes } from "@prisma/client";

interface Props {
  recipes: Recipes[];
}

function FavoriteRecipes({ recipes }: Props) {
  return (
    <Grid item>
      <Grid
        item
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
        <Typography variant="h6" component="div">
          FAVORITE RECIPES
        </Typography>
      </Grid>
      <Grid
        container
        item
        rowSpacing={1}
        columnSpacing={2}
        sx={{
          margin: "10px auto",
          maxWidth: "75%",
        }}
      >
        {recipes.map((recipe: any, i: number) => (
          <RecipeCard
            key={`card-${i}`}
            name={recipe.name}
            link={`/recipes/${recipe.name.replace(/\s+/g, "-").toLowerCase()}`}
            image={recipe.image}
          />
        ))}
      </Grid>
    </Grid>
  );
}

export default FavoriteRecipes;
