import { Box, Grid, Typography } from "@mui/material";

import { recipeHref } from "@/data/helpers";
import type { DiaryEntries, Recipes } from "@/generated/prisma/browser";

import DetailRecipeCard from "../cards/DetailRecipeCard";

import SectionHeader from "./SectionHeader";

// ─── UserRecentRecipes ────────────────────────────────────────────────────────

interface RecentRecipesProps {
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

export default function UserRecentRecipes({ diaryEntries }: RecentRecipesProps) {
  const recent = diaryEntries.slice(0, 2);

  return (
    <Box>
      <SectionHeader title="Recent Activity" />
      {recent.length === 0 ? (
        <Typography color="text.disabled" sx={{ py: 2 }} variant="body2">
          No recent activity yet.
        </Typography>
      ) : (
        <Grid container columnSpacing={2} rowSpacing={1}>
          {recent.map((entry, i) => (
            <DetailRecipeCard
              key={`recent-${i}`}
              date={String(entry.date)}
              image={entry.recipes.image}
              link={recipeHref(entry.recipes.creatorId, entry.recipes.name)}
              name={entry.recipes.name}
              rating={entry.rating === null ? undefined : Number(entry.rating)}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}
