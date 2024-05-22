import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { RECIPE_LIST_TYPE, USER_LIST_TYPE } from "../../types";
import { findUserByUsername } from "../../data/users";

interface Props {
  recipes: RECIPE_LIST_TYPE[];
  sessionUser: USER_LIST_TYPE;
}

function PopularRecipeActivity({ recipes, sessionUser }: Props) {
  function getTopLikedRecipes(followingList: string[]) {
    const recipeCount: { [key: string]: number } = {};

    followingList.forEach((username) => {
      const user = findUserByUsername(username);
      if (user && user.liked && user.liked.recipes) {
        user.liked.recipes.forEach((recipe) => {
          if (recipeCount[recipe]) {
            recipeCount[recipe]++;
          } else {
            recipeCount[recipe] = 1;
          }
        });
      }
    });

    const sortedRecipes = Object.entries(recipeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([recipe]) => recipe);
    return sortedRecipes;
  }

  let topLikedRecipes: string[] = [];

  if (sessionUser) {
    const followingList = sessionUser.following ?? [];
    topLikedRecipes = getTopLikedRecipes(followingList);
  }

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
          POPULAR WITH FRIENDS
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
        {topLikedRecipes.map((recipeName, i) => {
          const recipe = recipes.find((r) => r.name === recipeName);
          if (!recipe) return null;
          return (
            <RecipeCard
              key={`card-${i}`}
              name={recipe.name}
              image={recipe.image}
              sx={{
                height: "100%",
                width: "100%",
              }}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

function RecipeCard(props: any) {
  const recipeSlug = `/recipe/${props.name.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Grid item>
      <Link href={recipeSlug} underline="none">
        <Card
          sx={{
            height: "225px",
            width: "250px",
            cursor: "pointer",
          }}
        >
          <CardMedia
            sx={{ height: 140 }}
            image={props.image}
            title={props.name}
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {props.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default PopularRecipeActivity;
