import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Link from "@mui/material/Link";
import moment from "moment";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
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
            <Stack key={i} direction="row">
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <Link href={`/${user.username}`} underline="none">
                  <span style={{ margin: "0 2px" }}>{user.username}</span>
                </Link>
                <span style={{ margin: "0 2px" }}>made</span>
                <Link
                  href={`/recipe/${diaryEntry.recipe
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  <span style={{ margin: "0 2px" }}>{diaryEntry.recipe}</span>
                </Link>
                <span style={{ margin: "0 2px" }}>on</span>
                <span style={{ margin: "0 2px" }}>
                  {moment(diaryEntry.date).format("dddd, MMMM Do YYYY")}
                </span>
                <span style={{ margin: "0 2px" }}>and rated it</span>
                {diaryEntry.rating !== undefined && (
                  <span style={{ margin: "0 2px" }}>
                    <Rating
                      value={diaryEntry.rating}
                      precision={0.5}
                      readOnly
                    />
                  </span>
                )}
                <span>.</span>
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
