import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Link from "@mui/material/Link";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import Stack from "@mui/material/Stack";
import StarRating from "../../src/review/StarRating";
import { getAllUsers } from "../../src/data/users";
import { USER_LIST_TYPE } from "../../src/types";

interface Props {
  users: USER_LIST_TYPE[];
}

function Activity(props: Props) {
  const { users } = props;
  const user = users[0];
  const title = `${users[0].username}'s Activity Stream`;
  const diaryEntries = users[0].diary;
  const avatarSize = "56px";

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <Grid item />
        <ProfileLinkBar username={user.username} />
      </Grid>
      <Grid item xs={8} sx={{ marginTop: "10px" }}>
        <Stack
          spacing={1}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          {diaryEntries?.map((diaryEntry, i) => (
            <Stack key={i} direction="row" sx={{ justifyContent: "center" }}>
              <div>
                <Link href={`/${user.username}`} underline="none">
                  {user.username}
                </Link>
                {" made "}
                <Link
                  href={`/recipe/${diaryEntry.recipe
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  {diaryEntry.recipe}
                </Link>
                {" on "}
                {diaryEntry.date}
                {" and rated it "}
                <StarRating rating={diaryEntry.rating} />
                {"."}
              </div>
            </Stack>
          ))}
        </Stack>
      </Grid>
    </div>
  );
}

export async function getStaticProps() {
  const users = getAllUsers();

  return {
    props: {
      users,
    },
    revalidate: 1800,
  };
}

export default Activity;
