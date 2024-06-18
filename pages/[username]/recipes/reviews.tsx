import Grid from "@mui/material/Grid";
import Head from "next/head";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import { findUserByUsername, getAllUsers } from "../../../src/data/users";
import { getAllRecipes } from "../../../src/data/recipes";
import { getUserDiaryEntries } from "../../../src/data/diary";
import { DiaryEntries, Recipes, Users } from "@prisma/client";

interface Props {
  user: Users;
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserRecipeList({ user, diaryEntries }: Props) {
  const title = `${user.username}'s Reviews • Savry`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileLinkBar username={user.username} />
        <Grid item>No reviews yet.</Grid>
      </Grid>
    </div>
  );
}

export async function getStaticPaths() {
  const users = await getAllUsers();
  const paths = users.map((user) => ({
    params: { username: user.username },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const { username } = params;
  const user = await findUserByUsername(username);
  let diaryEntries: DiaryEntries[] = [];

  if (user) {
    diaryEntries = await getUserDiaryEntries(user.id);
  }

  return {
    props: {
      diaryEntries,
      user,
    },
    revalidate: 1800,
  };
}

export default UserRecipeList;
