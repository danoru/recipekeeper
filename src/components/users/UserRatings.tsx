import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts";
import { Reviews, Users } from "@prisma/client";

interface Props {
  reviews: (Reviews & { users: Users })[];
}

function UserRatings({ reviews }: Props) {
  if (!reviews) {
    return null;
  }

  const ratingDataset = generateRatingDataset(reviews);

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
      <Stack spacing={1}>
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
        />
      </Stack>
    </Grid>
  );
}

function generateRatingDataset(
  reviews: (Reviews & { users: Users })[]
): { rating: number; count: number }[] {
  const ratingCounts: { [rating: number]: number } = {};

  reviews.forEach((entry) => {
    const rating = entry.rating.toNumber();
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

export default UserRatings;
