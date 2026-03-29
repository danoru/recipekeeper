import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts";
import { Following } from "@prisma/client";
import dayjs from "dayjs";

import UserAvatar from "./UserAvatar";

import DetailRecipeCard from "../cards/DetailRecipeCard";
import type {
  SDiaryEntryWithRecipe,
  SReviewWithUser,
} from "../../types/serialized";
import { toSlug } from "../../data/helpers";

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <Box
      sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1, mb: 2 }}
    >
      <Typography
        variant="overline"
        sx={{
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          color: "text.disabled",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

// ─── UserFollowing ────────────────────────────────────────────────────────────

interface FollowingProps {
  following: Following[];
}

export function UserFollowing({ following }: FollowingProps) {
  return (
    <Box>
      <SectionHeader title="Following" />
      {following?.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ py: 2 }}>
          Not following anyone yet.
        </Typography>
      ) : (
        <Grid container spacing={1}>
          {following.map((user: any, i) => (
            <Grid item key={i}>
              <Tooltip title={user.followingUsername} placement="top" arrow>
                <Link href={`/${user.followingUsername}`} underline="none">
                  <UserAvatar avatarSize="48px" name={user.followingUsername} />
                </Link>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

// ─── UserRecentRecipes ────────────────────────────────────────────────────────

interface RecentRecipesProps {
  diaryEntries: SDiaryEntryWithRecipe[];
}

export function UserRecentRecipes({ diaryEntries }: RecentRecipesProps) {
  const recent = diaryEntries.slice(0, 4);

  return (
    <Box>
      <SectionHeader title="Recent Activity" />
      {recent.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ py: 2 }}>
          No recent activity yet.
        </Typography>
      ) : (
        <Grid container rowSpacing={1} columnSpacing={2}>
          {recent.map((entry, i) => (
            <DetailRecipeCard
              key={`recent-${i}`}
              date={entry.date}
              image={entry.recipes.image}
              link={`/recipes/${toSlug(entry.recipes.name)}`}
              name={entry.recipes.name}
              rating={entry.rating}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}

// ─── UserRatings ──────────────────────────────────────────────────────────────

interface RatingsProps {
  reviews: SReviewWithUser[];
}

export function UserRatings({ reviews }: RatingsProps) {
  if (!reviews?.length) return null;

  const ratingCounts: Record<number, number> = {};
  reviews.forEach((r) => {
    // r.rating is already a plain number — no .toNumber() needed
    ratingCounts[r.rating] = (ratingCounts[r.rating] ?? 0) + 1;
  });

  const dataset = Array.from({ length: 10 }, (_, i) => {
    const rating = (i + 1) * 0.5;
    return { rating, count: ratingCounts[rating] ?? 0 };
  });

  return (
    <Box>
      <SectionHeader title="Ratings" />
      <Stack spacing={1}>
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: "band", dataKey: "rating" }]}
          series={[{ dataKey: "count", color: "#c8a96e" }]}
          width={375}
          height={200}
          sx={{
            "& .MuiChartsAxis-tickLabel": { fill: "#888580", fontSize: 11 },
            "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.07)" },
            "& .MuiChartsAxis-tick": { stroke: "rgba(255,255,255,0.07)" },
          }}
        />
      </Stack>
    </Box>
  );
}

// ─── UserRecipeDiary ──────────────────────────────────────────────────────────

interface DiaryProps {
  diaryEntries: SDiaryEntryWithRecipe[];
}

export function UserRecipeDiary({ diaryEntries }: DiaryProps) {
  const limited = diaryEntries.slice(0, 9);

  const entriesByMonth: Record<string, SDiaryEntryWithRecipe[]> = {};
  limited.forEach((entry) => {
    const key = dayjs(entry.date).format("MMM YYYY");
    if (!entriesByMonth[key]) entriesByMonth[key] = [];
    entriesByMonth[key].push(entry);
  });

  return (
    <Box>
      <SectionHeader title="Diary" />
      {limited.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ py: 2 }}>
          No diary entries yet.
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {Object.entries(entriesByMonth).map(([month, entries]) => (
            <Box key={month}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "primary.main",
                  display: "block",
                  mb: 1,
                }}
              >
                {month}
              </Typography>
              <Stack spacing={0.5}>
                {entries.map((entry, i) => (
                  <Box
                    key={i}
                    component={Link}
                    href={`/recipes/${toSlug(entry.recipes.name)}`}
                    underline="none"
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr",
                      gap: 1.5,
                      alignItems: "baseline",
                      "&:hover .diary-name": { color: "primary.main" },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.disabled",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {dayjs(entry.date).format("D")}
                    </Typography>
                    <Typography
                      className="diary-name"
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        transition: "color 0.15s",
                        lineHeight: 1.5,
                      }}
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
