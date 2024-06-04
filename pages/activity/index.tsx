import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Link from "@mui/material/Link";
import moment from "moment";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { findUserByUsername } from "../../src/data/users";
import { getSession } from "next-auth/react";
import { getAllRecipes } from "../../src/data/recipes";
import { RECIPE_LIST_TYPE, USER_LIST_TYPE, UserDiary } from "../../src/types";

interface Props {
  recipes: RECIPE_LIST_TYPE[];
  session: any;
  sessionUser: USER_LIST_TYPE;
}

function Activity({ session, sessionUser, recipes }: Props) {
  const username = session?.user.username;
  const title = `${username}'s Activity Stream`;
  const avatarSize = "56px";

  function getDiaryEntries(followingList: string[]) {
    let allDiaryEntries: UserDiary[] = [];

    followingList.forEach((username) => {
      const user = findUserByUsername(username);
      if (user && user.diary) {
        const userEntries = user.diary.map((entry) => ({ ...entry, username }));
        allDiaryEntries = allDiaryEntries.concat(userEntries);
      }
    });

    return allDiaryEntries;
  }

  let diaryEntries: UserDiary[] = [];

  if (sessionUser) {
    const followingList = sessionUser.following ?? [];
    const selfIncludedFollowingList = [...followingList, sessionUser.username];
    diaryEntries = getDiaryEntries(selfIncludedFollowingList);
  }

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
          {diaryEntries?.map((entry: UserDiary, i: number) => {
            const recipe = recipes.find((r) => r.name === entry.recipe);
            if (!recipe) return null;
            return (
              <Stack key={i} direction="row">
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <Link href={`/${entry.username}`} underline="none">
                    <span style={{ margin: "0 2px" }}>{entry.username}</span>
                  </Link>
                  <span style={{ margin: "0 2px" }}>made</span>
                  <Link
                    href={`/recipe/${entry.recipe
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    underline="none"
                  >
                    <span style={{ margin: "0 2px" }}>{entry.recipe}</span>
                  </Link>
                  <span style={{ margin: "0 2px" }}>on</span>
                  <span style={{ margin: "0 2px" }}>
                    {moment(entry.date).format("dddd, MMMM Do YYYY")}
                  </span>
                  <span style={{ margin: "0 2px" }}>and rated it</span>
                  {entry.rating !== undefined && (
                    <span style={{ margin: "0 2px" }}>
                      <Rating value={entry.rating} precision={0.5} readOnly />
                    </span>
                  )}
                  <span>.</span>
                </div>
              </Stack>
            );
          })}
        </Stack>
      </Grid>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  let sessionUser = null;

  if (session) {
    const sessionUsername = session.user.username;
    sessionUser = findUserByUsername(sessionUsername);
  }

  const recipes = getAllRecipes();

  return {
    props: {
      recipes,
      session,
      sessionUser,
    },
  };
}

export default Activity;
