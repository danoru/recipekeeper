import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Link from "@mui/material/Link";
import moment from "moment";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { findUserByUsername, getFollowing } from "../../src/data/users";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { DiaryEntries, Recipes, Users } from "@prisma/client";
import { getDiaryEntriesByUsernames } from "../../src/data/diary";

interface Props {
  diaryEntries: (DiaryEntries & { recipes: Recipes; users: Users })[];
  user: Users;
}

function Activity({ diaryEntries, user }: Props) {
  const username = user.username;
  const title = `${username}'s Activity Stream`;
  const avatarSize = "56px";

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <Grid item />
        <ProfileLinkBar username={username} />
      </Grid>
      <Grid item xs={8} sx={{ marginTop: "10px" }}>
        <Stack
          spacing={1}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {diaryEntries?.map(
            (
              entry: DiaryEntries & { recipes: Recipes; users: Users },
              i: number
            ) => {
              return (
                <Stack key={i} direction="row">
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <Link href={`/${entry.users.username}`} underline="none">
                      <span style={{ margin: "0 2px" }}>
                        {entry.users.username}
                      </span>
                    </Link>
                    <span style={{ margin: "0 2px" }}>made</span>
                    <Link
                      href={`/recipe/${entry.recipes.name
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                      underline="none"
                    >
                      <span style={{ margin: "0 2px" }}>
                        {entry.recipes.name}
                      </span>
                    </Link>
                    <span style={{ margin: "0 2px" }}>on</span>
                    <span style={{ margin: "0 2px" }}>
                      {moment(entry.date).format("dddd, MMMM Do YYYY")}
                    </span>
                    <span style={{ margin: "0 2px" }}>and rated it</span>
                    {entry.rating !== undefined && (
                      <span style={{ margin: "0 2px" }}>
                        <Rating
                          value={entry.rating.toNumber()}
                          precision={0.5}
                          readOnly
                        />
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
      const following = await getFollowing(user.id);
      usernames = following.map((user) => user.followingUsername);
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
