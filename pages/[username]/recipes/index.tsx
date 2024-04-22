import Grid from "@mui/material/Grid";
import Head from "next/head";
import RecipeList from "../../../src/components/recipes/RecipeList";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import { getAllUsers } from "../../../src/data/users";
import { RECIPE_LIST_TYPE, USER_LIST_TYPE } from "../../../src/types";
import { getAllRecipes } from "../../../src/data/recipes";

interface Props {
  user: USER_LIST_TYPE;
  recipes: RECIPE_LIST_TYPE[];
}

function UserRecipeList(props: Props) {
  const { user, recipes } = props;
  const title = `${user.profile.name}'s Recipes • Savry`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileLinkBar username={user.username} />
        <RecipeList recipes={recipes} />
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

  const recipes = getAllRecipes().filter((recipe) =>
    user?.diary?.some((entry) => entry.recipe === recipe.name)
  );

  return {
    props: {
      recipes,
      user,
    },
    revalidate: 1800,
  };
}

export default UserRecipeList;
