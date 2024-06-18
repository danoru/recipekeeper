import Grid from "@mui/material/Grid";
import Head from "next/head";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import RecipeList from "../../src/components/recipes/RecipeList";
import { findUserByUsername, getAllUsers } from "../../src/data/users";
import { getCooklist } from "../../src/data/recipes";
import { Cooklist, Recipes, Users } from "@prisma/client";

interface Props {
  user: Users;
  cooklist: (Cooklist & { recipes: Recipes })[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserCooklist({ cooklist, user }: Props) {
  const title = `${user.username}'s Cooklist • Savry`;
  const header = `${user.username} WANTS TO COOK ${cooklist.length} RECIPES`;
  const style = "overline";
  const recipes = cooklist.map((item) => item.recipes);

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileLinkBar username={user.username} />
        <RecipeList recipes={recipes} header={header} style={style} />
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
  let cooklist: Cooklist[] = [];

  if (user) {
    cooklist = await getCooklist(user.id);
  }

  return {
    props: {
      cooklist,
      user,
    },
    revalidate: 1800,
  };
}

export default UserCooklist;
