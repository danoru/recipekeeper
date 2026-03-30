import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import NextLink from "next/link";

import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import UserAvatar from "../../src/components/users/UserAvatar";
import { findUserByUsername, getAllUsers, getFollowers } from "../../src/data/users";

interface Props {
  user: any;
  followers: any[];
}

export default function UserFollowers({ user, followers }: Props) {
  const title = `${user.username}'s Followers • Savry`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "720px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: 4,
          pb: 12,
        }}
      >
        <ProfileLinkBar username={user.username} />

        <Box sx={{ mt: 3, mb: 3 }}>
          <ButtonGroup size="small" variant="outlined">
            <Button component={NextLink} href={`/${user.username}/following`}>
              Following
            </Button>
            <Button component={NextLink} href={`/${user.username}/followers`}>
              Followers
            </Button>
          </ButtonGroup>
        </Box>

        <Box
          sx={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {followers.length === 0 ? (
            <Typography sx={{ fontSize: "0.875rem", color: "text.disabled", p: 3 }}>
              No followers yet.
            </Typography>
          ) : (
            followers.map((follower: any, i: number) => {
              const username = follower.users?.username ?? follower.username;
              return (
                <Box key={username}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#1a1a1a" },
                    }}
                  >
                    <MuiLink
                      component={NextLink}
                      href={`/${username}`}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      underline="none"
                    >
                      <UserAvatar avatarSize="36px" name={username} />
                      <Typography sx={{ fontSize: "0.9375rem", color: "text.primary" }}>
                        {username}
                      </Typography>
                    </MuiLink>
                  </Box>
                  {i < followers.length - 1 && <Divider />}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const users = await getAllUsers();
  return {
    paths: users.map((u) => ({ params: { username: u.username } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await findUserByUsername(username);
  if (!user) return { notFound: true };

  const followers = await getFollowers(username);

  return {
    props: { user, followers },
    revalidate: 1800,
  };
}
