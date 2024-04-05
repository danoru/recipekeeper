import Grid from "@mui/material/Grid";
import Head from "next/head";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import ProfileStatBar from "../../src/components/users/ProfileStatBar";
import { getAllUsers } from "../../src/data/users";
import { USER_LIST_TYPE } from "../../src/types";

interface Props {
  user: USER_LIST_TYPE;
}

function UserPage(props: Props) {
  const { user } = props;
  const title = `${user.profile.name}'s Profile • Savry`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileStatBar />
        <ProfileLinkBar />
        <Grid item xs={8}>
          Favorite Creators
        </Grid>
        {/* <Grid item xs={4}>
          Cooklist
        </Grid> */}
        <Grid item xs={8}>
          Favorite Recipes
        </Grid>
        {/* <Grid item xs={4}>
          Ratings
        </Grid>
        <Grid item xs={8}>
          Recent Activity
        </Grid>
        <Grid item xs={4}>
          Cooklist
        </Grid>
        <Grid item xs={8}>
          Following
        </Grid>
        <Grid item xs={4}>
          Diary
        </Grid>
        <Grid item xs={4}>
          Activity
        </Grid> */}
      </Grid>
    </div>
  );
}

export async function getStaticPaths() {
  const users = getAllUsers();
  const paths = users.map((user) => ({
    params: { username: user.username },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const { username } = params;
  const user = getAllUsers().find((user) => user.username === username);

  return {
    props: {
      user,
    },
    revalidate: 1800,
  };
}

export default UserPage;
