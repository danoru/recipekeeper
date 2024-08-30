import DetailRecipeCard from "../cards/DetailRecipeCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DiaryEntries, Recipes } from "@prisma/client";

interface Props {
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

function UserRecentRecipes({ diaryEntries }: Props) {
  const userDiary = diaryEntries.slice(0, 4);
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
        {userDiary.map(
          (entry: DiaryEntries & { recipes: Recipes }, i: number) => {
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
              />
            );
          }
        )}
      </Grid>
    </Grid>
  );
}

export default UserRecentRecipes;
