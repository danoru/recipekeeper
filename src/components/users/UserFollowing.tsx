import { Box, Grid, Link, Tooltip, Typography } from "@mui/material";
import { Following } from "@prisma/client";

import SectionHeader from "./SectionHeader";
import UserAvatar from "./UserAvatar";

interface FollowingProps {
  following: Following[];
}

export default function UserFollowing({ following }: FollowingProps) {
  return (
    <Box>
      <SectionHeader title="Following" />
      {following?.length === 0 ? (
        <Typography color="text.disabled" sx={{ py: 2 }} variant="body2">
          Not following anyone yet.
        </Typography>
      ) : (
        <Grid container spacing={1}>
          {following.map((user: any, i) => (
            <Grid key={i}>
              <Tooltip arrow placement="top" title={user.followingUsername}>
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
