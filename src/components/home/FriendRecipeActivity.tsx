import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import moment from "moment";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { DiaryEntries, Recipes, Users } from "@prisma/client";

interface Props {
  recipes: Recipes[];
  sessionUser: Users | null;
  recentEntries: (DiaryEntries & { users: Users })[];
}

function FriendRecipeActivity({ recipes, recentEntries }: Props) {
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
          NEW RECIPES FROM FRIENDS
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
        {recentEntries?.map(
          (entry: DiaryEntries & { users: Users }, i: number) => {
            const recipe = recipes.find((r) => r.id === entry.recipeId);
            if (!recipe) return null;
            return (
              <RecipeCard
                key={`card-${i}`}
                name={recipe.name}
                image={recipe.image}
                rating={entry.rating}
                date={entry.date}
                username={entry.users.username}
                sx={{
                  height: "100%",
                  width: "100%",
                }}
              />
            );
          }
        )}
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
            height: "300px",
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
            <Typography variant="body1" component="div">
              {props.name}
            </Typography>
            <Typography variant="body2" component="div">
              {props.username}
            </Typography>
            <Rating value={props.rating} size="small" readOnly />
            <Typography variant="body2" component="div">
              {moment(props.date).format("MMM DD")}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default FriendRecipeActivity;
