import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

import StarRating from "../ui/StarRating";
import UserAvatar from "../users/UserAvatar";

export interface FriendScore {
  user: { username: string };
  /** The friend's average rating of this recipe, or null if they never rated it. */
  score: number | null;
  timesCooked: number;
}

export default function RecipeFriendRatings({ friends }: { friends: FriendScore[] }) {
  if (!friends.length) return null;

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#4a4744",
          mb: 1.5,
          pb: 1,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        Friends who cooked this
      </Typography>
      <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
        {friends.map(({ user, score, timesCooked }) => (
          <Box
            key={user.username}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}
          >
            <MuiLink component={NextLink} href={`/${user.username}`} underline="none">
              <UserAvatar avatarSize="32px" name={user.username} />
            </MuiLink>
            {score !== null ? (
              <StarRating rating={score} size="sm" />
            ) : (
              <Typography sx={{ fontSize: "0.6875rem", color: "text.disabled" }}>N/A</Typography>
            )}
            {timesCooked > 1 && (
              <Typography sx={{ fontSize: "0.625rem", color: "text.disabled" }}>
                cooked {timesCooked}×
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
