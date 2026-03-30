import { memo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Recipes, Users } from "@prisma/client";
import type { SDiaryEntry } from "../../types/serialized";
import FriendRecipeCard from "../cards/FriendRecipeCard";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  recentEntries: (SDiaryEntry & { users: Users; recipes: Recipes })[];
}

function FriendRecipeActivity({ recentEntries }: Props) {
  const entries = recentEntries.slice(0, 6);

  return (
    <Box sx={{ mb: 5 }}>
      <SectionHeader label="New recipes from friends" href="/members" />
      <Grid container spacing={1.5}>
        {entries.map(
          (
            entry: SDiaryEntry & { users: Users; recipes: Recipes },
            i: number,
          ) => {
            const slug = entry.recipes.name.replace(/\s+/g, "-").toLowerCase();
            return (
              <Grid item xs={6} sm={4} key={`friend-${i}`}>
                <FriendRecipeCard
                  date={entry.date}
                  image={entry.recipes.image}
                  link={`/recipes/${slug}`}
                  name={entry.recipes.name}
                  rating={entry.rating}
                  username={entry.users.username}
                />
              </Grid>
            );
          },
        )}
      </Grid>
    </Box>
  );
}

export default memo(FriendRecipeActivity);
