import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { memo } from "react";

import { recipeHref } from "@/data/helpers";
import type { DiaryEntries, Recipes, Users } from "@/generated/prisma/browser";

import FriendRecipeCard from "../cards/FriendRecipeCard";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  recentEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
}

function FriendRecipeActivity({ recentEntries }: Props) {
  const entries = recentEntries.slice(0, 6);

  return (
    <Box sx={{ mb: 5 }}>
      <SectionHeader href="/members" label="New recipes from friends" />
      <Grid container spacing={1.5}>
        {entries.map((entry: DiaryEntries & { users: Users; recipes: Recipes }, i: number) => {
          return (
            <Grid key={`friend-${i}`} size={{ sm: 4, xs: 6 }}>
              <FriendRecipeCard
                date={dayjs(entry.date)}
                image={entry.recipes.image}
                link={recipeHref(entry.recipes.creatorId, entry.recipes.name)}
                name={entry.recipes.name}
                rating={entry.rating === null ? null : Number(entry.rating)}
                username={entry.users.username}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default memo(FriendRecipeActivity);
