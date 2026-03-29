import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Head from "next/head";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import StarRating from "../../src/components/ui/StarRating";
import Typography from "@mui/material/Typography";
import { findUserByUsername, getFollowingList } from "../../src/data/users";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { getDiaryEntriesByUsernames } from "../../src/data/diary";
import { recipeHref, serializePrisma } from "../../src/data/helpers";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import { SDiaryEntryComplete } from "../../src/types/serialized";

dayjs.extend(advancedFormat);

interface Props {
  diaryEntries: SDiaryEntryComplete[];
  user: any;
}

export default function Activity({ diaryEntries, user }: Props) {
  if (!user) return null;

  const username = user.username;

  return (
    <>
      <Head>
        <title>{`${username}'s Activity Stream • Savry`}</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 4,
          pb: 12,
        }}
      >
        <ProfileLinkBar username={username} />

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 0 }}>
          {diaryEntries.map((entry, i) => {
            const recipeName = entry.recipes?.name ?? "";
            const creatorName = entry.recipes?.creators?.name ?? "";
            const formattedDate = entry.date
              ? dayjs(entry.date).format("dddd, MMMM Do YYYY")
              : "";

            return (
              <Box key={i}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.5,
                    py: 1.25,
                    px: 1,
                    borderRadius: "6px",
                    transition: "background 0.15s",
                    "&:hover": { bgcolor: "#1a1a1a" },
                  }}
                >
                  <MuiLink
                    component={NextLink}
                    href={`/${entry.users.username}`}
                    underline="none"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "text.primary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {entry.users.username}
                  </MuiLink>

                  <Typography
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    made
                  </Typography>

                  <MuiLink
                    component={NextLink}
                    href={recipeHref(creatorName, recipeName)}
                    underline="none"
                    sx={{
                      fontSize: "0.875rem",
                      fontStyle: "italic",
                      fontFamily: "'Playfair Display', serif",
                      color: "text.primary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {recipeName}
                  </MuiLink>

                  <Typography
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    on {formattedDate} and rated it
                  </Typography>

                  {entry.rating != null && (
                    <StarRating rating={entry.rating} size="sm" />
                  )}

                  <Typography
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    .
                  </Typography>
                </Box>
                {i < diaryEntries.length - 1 && <Divider />}
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const username = session.user.username;
  const user = await findUserByUsername(username);

  if (!user) return { notFound: true };

  const following = await getFollowingList(user.id);
  const usernames = [...following, username];
  const diaryEntries = await getDiaryEntriesByUsernames(usernames);

  return {
    props: serializePrisma({ diaryEntries, user }),
  };
}
