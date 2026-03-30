import { Box, Link, Stack, Typography } from "@mui/material";
import { DiaryEntries, Recipes } from "@prisma/client";
import dayjs from "dayjs";

import { toSlug } from "../../data/helpers";

import SectionHeader from "./SectionHeader";

// ─── UserRecipeDiary ──────────────────────────────────────────────────────────

interface DiaryProps {
  diaryEntries: DiaryEntries[] & { recipes: Recipes }[];
}

export default function UserRecipeDiary({ diaryEntries }: DiaryProps) {
  const limited = diaryEntries.slice(0, 9);

  const entriesByMonth: Record<string, DiaryEntries[] & { recipes: Recipes }[]> = {};
  limited.forEach((entry) => {
    const key = dayjs(entry.date).format("MMM YYYY");
    if (!entriesByMonth[key]) entriesByMonth[key] = [];
    entriesByMonth[key].push(entry);
  });

  return (
    <Box>
      <SectionHeader title="Diary" />
      {limited.length === 0 ? (
        <Typography color="text.disabled" sx={{ py: 2 }} variant="body2">
          No diary entries yet.
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {Object.entries(entriesByMonth).map(([month, entries]) => (
            <Box key={month}>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "primary.main",
                  display: "block",
                  mb: 1,
                }}
                variant="overline"
              >
                {month}
              </Typography>
              <Stack spacing={0.5}>
                {entries.map((entry, i) => (
                  <Box
                    key={i}
                    component={Link}
                    href={`/recipes/${toSlug(entry.recipes.name)}`}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr",
                      gap: 1.5,
                      alignItems: "baseline",
                      "&:hover .diary-name": { color: "primary.main" },
                    }}
                    underline="none"
                  >
                    <Typography
                      sx={{
                        color: "text.disabled",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                      variant="caption"
                    >
                      {dayjs(entry.date).format("D")}
                    </Typography>
                    <Typography
                      className="diary-name"
                      sx={{
                        color: "text.primary",
                        transition: "color 0.15s",
                        lineHeight: 1.5,
                      }}
                      variant="body2"
                    >
                      {entry.recipes.name}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
