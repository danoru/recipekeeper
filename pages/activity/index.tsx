import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { DiaryEntries, Recipes, Users } from "@prisma/client";
import dayjs from "dayjs";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";

import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import { getDiaryEntriesByUsernames } from "../../src/data/diary";
import { findUserByUsername, getFollowingList } from "../../src/data/users";

interface Props {
  diaryEntries: (DiaryEntries & { recipes: Recipes; users: Users })[];
  user: Users;
}

function Activity({ diaryEntries, user }: Props) {
  const username = user.username;
  const title = `${username}'s Activity Stream`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <Grid />
        <ProfileLinkBar username={username} />
      </Grid>
      <Grid size={{ xs: 8 }} sx={{ marginTop: "10px" }}>
        <Stack divider={<Divider flexItem orientation="horizontal" />} spacing={1}>
          {diaryEntries?.map(
            (entry: DiaryEntries & { recipes: Recipes; users: Users }, i: number) => {
              return (
                <Stack key={i} direction="row">
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <Link href={`/${entry.users.username}`} underline="none">
                      <span style={{ margin: "0 2px" }}>{entry.users.username}</span>
                    </Link>
                    <span style={{ margin: "0 2px" }}>made</span>
                    <Link
                      href={`/recipes/${entry.recipes.name.toLowerCase().replace(/ /g, "-")}`}
                      underline="none"
                    >
                      <span style={{ margin: "0 2px" }}>{entry.recipes.name}</span>
                    </Link>
                    <span style={{ margin: "0 2px" }}>on</span>
                    <span style={{ margin: "0 2px" }}>
                      {dayjs(entry.date).format("dddd, MMMM Do YYYY")}
                    </span>
                    <span style={{ margin: "0 2px" }}>and rated it</span>
                    {entry.rating !== undefined && (
                      <span style={{ margin: "0 2px" }}>
                        <Rating readOnly precision={0.5} value={entry.rating.toNumber()} />
                      </span>
                    )}
                    <span>.</span>
                  </div>
                </Stack>
              );
            }
          )}
        </Stack>
      </Grid>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  let user = null;
  let usernames: string[] = [];
  let diaryEntries: DiaryEntries[] = [];

  if (session) {
    const username = session.user.username;
    user = await findUserByUsername(username);

    if (user) {
      usernames = await getFollowingList(user.id);
      usernames.push(username);
    }
    diaryEntries = await getDiaryEntriesByUsernames(usernames);
  }

  return {
    props: {
      diaryEntries,
      session,
      user,
    },
  };
}

export default Activity;
