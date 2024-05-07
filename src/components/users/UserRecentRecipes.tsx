import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { RECIPE_LIST_TYPE, USER_LIST_TYPE, UserDiary } from "../../types";

interface Props {
  user: USER_LIST_TYPE;
  recipes: RECIPE_LIST_TYPE[];
}

function UserRecentRecipes({ recipes, user }: Props) {
  const diaryEntries: UserDiary[] = user.diary || [];

  const sortedEntries = diaryEntries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const mostRecentEntries = sortedEntries.slice(0, 4);
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
          margin: "0 auto",
          width: "75%",
        }}
      >
        <Typography variant="h6" component="div">
          RECENT ACTIVITY
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
        {mostRecentEntries.map((entry: UserDiary, i: number) => {
          const recipe = recipes.find((r) => r.name === entry.recipe);

          return (
            recipe && (
              <RecipeCard
                key={`card-${i}`}
                name={recipe.name}
                image={recipe.image}
                rating={entry.rating}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              />
            )
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
      <Link href={recipeSlug}>
        <Card
          sx={{
            width: "200px",
            height: "200px",
            cursor: "pointer",
          }}
        >
          <CardMedia
            sx={{ height: 140 }}
            image={props.image}
            title={props.name}
          />
          <CardContent>
            <Rating value={props.rating} precision={0.5} readOnly />
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default UserRecentRecipes;
