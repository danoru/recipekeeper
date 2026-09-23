import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts";

import { halfStarHistogram } from "@/lib/scores";

interface Props {
  /** Scores from 0.5 to 5; each is rounded to the nearest half star. */
  scores: number[];
  emptyText?: string;
}

/** Half-star distribution chart, used for recipe and profile ratings. */
export default function RatingHistogram({ scores, emptyText = "No ratings yet." }: Props) {
  if (scores.length === 0) {
    return (
      <Typography sx={{ fontSize: "0.8125rem", color: "text.disabled" }}>{emptyText}</Typography>
    );
  }

  return (
    <BarChart
      dataset={halfStarHistogram(scores)}
      height={200}
      margin={{ left: 0 }}
      series={[{ dataKey: "count", color: "#c8a96e" }]}
      sx={{
        "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.15)" },
        "& .MuiChartsAxis-tick": { stroke: "rgba(255,255,255,0.15)" },
        "& .MuiChartsAxis-tickLabel": { fill: "#4a4744", fontSize: "0.6875rem" },
      }}
      width={375}
      xAxis={[{ scaleType: "band", dataKey: "rating" }]}
    />
  );
}
