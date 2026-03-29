import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Head from "next/head";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBookOutlined";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrillOutlined";
import UserAvatar from "../../src/components/users/UserAvatar";
import { getAllUsers } from "../../src/data/users";
import { serializePrisma } from "../../src/data/helpers";

interface SerializedUser {
  id: number;
  username: string;
  image: string | null;
  joinDate: string;
  [key: string]: any;
}

interface Props {
  users: SerializedUser[];
}

export default function Members({ users }: Props) {
  const filtered = users.filter((u) => u.username !== "guest");

  return (
    <>
      <Head>
        <title>Members • Savry</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "720px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: 5,
          pb: 12,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: "1.75rem", sm: "2.25rem" },
            fontWeight: 400,
            color: "text.primary",
            lineHeight: 1.2,
            mb: 0.75,
          }}
        >
          Members
        </Typography>
        <Typography
          sx={{ fontSize: "0.8125rem", color: "text.disabled", mb: 4 }}
        >
          Food lovers, critics, and friends.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {filtered.map((user, i) => (
            <Box key={user.username}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "#1a1a1a" },
                }}
              >
                {/* Avatar + username */}
                <MuiLink
                  component={NextLink}
                  href={`/${user.username}`}
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                  }}
                >
                  <UserAvatar avatarSize="36px" name={user.username} />
                  <Typography
                    sx={{
                      fontSize: "0.9375rem",
                      color: "text.primary",
                      fontWeight: 400,
                    }}
                  >
                    {user.username}
                  </Typography>
                </MuiLink>

                {/* Quick links */}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title="Recipes" placement="top">
                    <MuiLink
                      component={NextLink}
                      href={`/${user.username}/recipes`}
                      sx={{
                        display: "flex",
                        p: 0.75,
                        borderRadius: "6px",
                        color: "text.disabled",
                        transition: "color 0.15s, background 0.15s",
                        "&:hover": {
                          color: "text.primary",
                          bgcolor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <OutdoorGrillIcon sx={{ fontSize: 18 }} />
                    </MuiLink>
                  </Tooltip>
                  <Tooltip title="Cooklist" placement="top">
                    <MuiLink
                      component={NextLink}
                      href={`/${user.username}/cooklist`}
                      sx={{
                        display: "flex",
                        p: 0.75,
                        borderRadius: "6px",
                        color: "text.disabled",
                        transition: "color 0.15s, background 0.15s",
                        "&:hover": {
                          color: "text.primary",
                          bgcolor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <MenuBookIcon sx={{ fontSize: 18 }} />
                    </MuiLink>
                  </Tooltip>
                  <Tooltip title="Likes" placement="top">
                    <MuiLink
                      component={NextLink}
                      href={`/${user.username}/likes`}
                      sx={{
                        display: "flex",
                        p: 0.75,
                        borderRadius: "6px",
                        color: "text.disabled",
                        transition: "color 0.15s, background 0.15s",
                        "&:hover": {
                          color: "text.primary",
                          bgcolor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 18 }} />
                    </MuiLink>
                  </Tooltip>
                </Box>
              </Box>
              {i < filtered.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

export async function getStaticProps() {
  const users = await getAllUsers();
  return {
    props: serializePrisma({ users }),
    revalidate: 1800,
  };
}
