import DetailRecipeCard from "../cards/DetailRecipeCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DiaryEntries, Recipes, Users } from "@prisma/client";

interface Props {
  recentEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
}

function FriendRecipeActivity({ recentEntries }: Props) {
  const userDiary = recentEntries.slice(0, 5);
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
        {userDiary.map(
          (
            entry: DiaryEntries & { users: Users; recipes: Recipes },
            i: number
          ) => {
            return (
              <DetailRecipeCard
                key={`card-${i}`}
                date={entry.date}
                image={entry.recipes.image}
                link={`/recipes/${entry.recipes.name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
                name={entry.recipes.name}
                rating={entry.rating}
                username={entry.users.username}
              />
            );
          }
        )}
      </Grid>
    </Grid>
  );
}

export default FriendRecipeActivity;
