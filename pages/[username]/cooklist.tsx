import Grid from "@mui/material/Grid";
import Head from "next/head";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import RecipeList from "../../src/components/recipes/RecipeList";
import { getAllUsers } from "../../src/data/users";
import { RECIPE_LIST_TYPE, USER_LIST_TYPE } from "../../src/types";
import { getAllRecipes } from "../../src/data/recipes";

interface Props {
  user: USER_LIST_TYPE;
  recipes: RECIPE_LIST_TYPE[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserCooklist(props: Props) {
  const { user, recipes } = props;
  const title = `${user.profile.name}'s Cooklist • Savry`;
  const header = `${user.profile.name} WANTS TO COOK ${recipes.length} RECIPES`;
  const style = "overline";

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
  const users = getAllUsers();
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
  const user = getAllUsers().find((user) => user.username === username);

  const recipes = getAllRecipes().filter((recipe) =>
    user?.cooklist?.includes(recipe.name)
  );

  return {
    props: {
      recipes,
      user,
    },
    revalidate: 1800,
  };
}

export default UserCooklist;
