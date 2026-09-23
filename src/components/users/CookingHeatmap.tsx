import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

import type { CookingActivity } from "@/lib/stats";

import SectionHeader from "./SectionHeader";

const CELL = 10;
const GAP = 3;

function cellColor(count: number) {
  if (count === 0) return "rgba(255,255,255,0.05)";
  if (count === 1) return "rgba(200,169,110,0.4)";
  if (count === 2) return "rgba(200,169,110,0.7)";
  return "#c8a96e";
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default function CookingHeatmap({ activity }: { activity: CookingActivity }) {
  const { weeks, currentStreak, longestStreak, totalLastYear } = activity;

  return (
    <Box>
      <SectionHeader title="Cooking activity" />

      <Box sx={{ display: "flex", gap: 3, mb: 1.5, flexWrap: "wrap" }}>
        <Stat label="in the last year" value={plural(totalLastYear, "meal")} />
        <Stat label="current streak" value={plural(currentStreak, "day")} />
        <Stat label="best streak" value={plural(longestStreak, "day")} />
      </Box>

      {/*
        Shows as many recent weeks as fit, with no scrollbar: weeks are laid out
        newest-first from the right (row-reverse), and whole weeks that don't fit
        wrap onto a second row that the fixed height hides.
      */}
      <Box
        aria-label={`Cooking activity heatmap: ${plural(totalLastYear, "meal")} in the last year`}
        role="img"
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          columnGap: `${GAP}px`,
          rowGap: `${GAP * 4}px`,
          height: 7 * CELL + 6 * GAP,
          overflow: "hidden",
        }}
      >
        {[...weeks].reverse().map((week) => (
          <Box
            key={week[0]?.date}
            sx={{ display: "flex", flexDirection: "column", gap: `${GAP}px` }}
          >
            {week.map((cell) => (
              <Box
                key={cell.date}
                sx={{
                  width: CELL,
                  height: CELL,
                  borderRadius: "2px",
                  bgcolor: cellColor(cell.count),
                }}
                title={`${cell.count ? plural(cell.count, "meal") : "Nothing logged"} on ${dayjs(cell.date).format("MMM D, YYYY")}`}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.125rem", lineHeight: 1.2 }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: "0.6875rem", color: "text.disabled" }}>{label}</Typography>
    </Box>
  );
}
