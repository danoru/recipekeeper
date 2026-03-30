import { Box, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { Reviews, Users } from "@prisma/client";

import SectionHeader from "./SectionHeader";

interface Props {
  reviews: (Reviews & { users: Users })[];
}

export default function UserRatings({ reviews }: Props) {
  if (!reviews?.length) return null;

  const ratingDataset = generateRatingDataset(reviews);
  return (
    <Box>
      <SectionHeader title="Ratings" />
      <Stack spacing={1}>
        <BarChart
          dataset={ratingDataset}
          height={200}
          series={[{ dataKey: "count", color: "#c8a96e" }]}
          sx={{
            "& .MuiChartsAxis-tickLabel": { fill: "#888580", fontSize: 11 },
            "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.07)" },
            "& .MuiChartsAxis-tick": { stroke: "rgba(255,255,255,0.07)" },
          }}
          width={375}
          xAxis={[{ scaleType: "band", dataKey: "rating" }]}
        />
      </Stack>
    </Box>
  );
}

function generateRatingDataset(
  reviews: (Reviews & { users: Users })[]
): { rating: number; count: number }[] {
  const ratingCounts: { [rating: number]: number } = {};

  reviews.forEach((entry) => {
    const rating = Number(entry.rating);
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
