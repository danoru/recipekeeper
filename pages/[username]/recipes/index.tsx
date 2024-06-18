import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../../src/components/recipes/RecipeList";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import { findUserByUsername, getAllUsers } from "../../../src/data/users";
import { DiaryEntries, Recipes, Users } from "@prisma/client";
import { getUserDiaryEntries } from "../../../src/data/diary";

interface Props {
  user: Users;
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserRecipeList({ diaryEntries, user }: Props) {
  const title = `${user.username}'s Recipes • Savry`;
  const header = "RECIPES";
  const recipes = diaryEntries.map((entry) => entry.recipes);

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileLinkBar username={user.username} />
        <RecipeList recipes={recipes} header={header} />
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
