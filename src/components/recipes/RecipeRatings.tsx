import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts";
import { Recipes, Reviews } from "@prisma/client";

interface Props {
  recipe: Recipes & { reviews: Reviews[] };
}

function RecipeRatings({ recipe }: Props) {
  const ratingDataset = generateRatingDataset(recipe.reviews);

  return (
    <Grid item sx={{ marginTop: "10px" }}>
      <Grid
        container
        sx={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          justifyContent: "space-between",
          margin: "10px 0",
          maxWidth: "50%",
        }}
      >
        <Grid item>RATINGS</Grid>
      </Grid>
      <Stack>
        <BarChart
          dataset={ratingDataset}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "rating",
            },
          ]}
          series={[{ dataKey: "count" }]}
          width={375}
          height={225}
          margin={{
            left: 0,
          }}
        />
      </Stack>
    </Grid>
  );
}

function generateRatingDataset(
  reviews: Reviews[]
): { rating: number; count: number }[] {
  const ratingCounts: { [rating: number]: number } = {};

  reviews.forEach((review) => {
    const rating = review.rating.toNumber();
    if (rating !== undefined) {
      if (ratingCounts[rating]) {
        ratingCounts[rating]++;
      } else {
        ratingCounts[rating] = 1;
      }
    }
  });

  const ratingDataset: { rating: number; count: number }[] = [];

  for (let rating = 0.5; rating <= 5; rating += 0.5) {
    ratingDataset.push({ rating, count: ratingCounts[rating] || 0 });
  }

  return ratingDataset;
}

export default RecipeRatings;
