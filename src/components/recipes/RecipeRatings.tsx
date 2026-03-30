import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts";
import { Recipes, Reviews } from "@prisma/client";

interface Props {
  recipe: Recipes & {
    reviews: Reviews[];
  };
}

function generateRatingDataset(reviews: Reviews[]) {
  const counts: Record<number, number> = {};
  reviews.forEach((r) => {
    if (r.rating != null) counts[Number(r.rating)] = (counts[Number(r.rating)] ?? 0) + 1;
  });
  return Array.from({ length: 10 }, (_, i) => {
    const rating = (i + 1) * 0.5;
    return { rating, count: counts[rating] ?? 0 };
  });
}

export default function RecipeRatings({ recipe }: Props) {
  if (!recipe.reviews?.length) {
    return (
      <Typography sx={{ fontSize: "0.8125rem", color: "text.disabled" }}>
        No ratings yet.
      </Typography>
    );
  }

  const dataset = generateRatingDataset(recipe.reviews);

  return (
    <Stack>
      <BarChart
        dataset={dataset}
        height={200}
        margin={{ left: 0 }}
        series={[{ dataKey: "count", color: "#c8a96e" }]}
        sx={{
          "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.15)" },
          "& .MuiChartsAxis-tick": { stroke: "rgba(255,255,255,0.15)" },
          "& .MuiChartsAxis-tickLabel": {
            fill: "#4a4744",
            fontSize: "0.6875rem",
          },
        }}
        width={375}
        xAxis={[{ scaleType: "band", dataKey: "rating" }]}
      />
    </Stack>
  );
}
