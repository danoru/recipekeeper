import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { DiaryEntries, Recipes } from "@prisma/client";

interface Props {
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

function UserRecentRecipes({ diaryEntries }: Props) {
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
        {diaryEntries.map(
          (entry: DiaryEntries & { recipes: Recipes }, i: number) => {
            return (
              <RecipeCard
                key={`card-${i}`}
                name={entry.recipes.name}
                image={entry.recipes.image}
                rating={entry.rating}
                sx={{
                  width: "100%",
                  height: "100%",
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
