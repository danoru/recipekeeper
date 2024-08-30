import Grid from "@mui/material/Grid";
import RecipeCard from "../cards/RecipeCard";
import Typography from "@mui/material/Typography";
import { Recipes } from "@prisma/client";

interface Props {
  recipes: Recipes[];
}

function PopularRecipeActivity({ recipes }: Props) {
  return (
    <Grid container>
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
        <Typography variant="overline" component="div">
          RECIPES POPULAR WITH FRIENDS
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
        {recipes.slice(0, 5).map((recipe, i) => {
          return (
            <RecipeCard
              key={`card-${i}`}
              name={recipe.name}
              image={recipe.image}
              link={`/recipes/${recipe.name
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

export default PopularRecipeActivity;
