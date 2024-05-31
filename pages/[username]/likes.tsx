import CreatorList from "../../src/components/creators/CreatorList";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import RecipeList from "../../src/components/recipes/RecipeList";
import { getAllCreators } from "../../src/data/creators";
import { getAllRecipes } from "../../src/data/recipes";
import { getAllUsers } from "../../src/data/users";
import {
  CREATOR_LIST_TYPE,
  RECIPE_LIST_TYPE,
  USER_LIST_TYPE,
} from "../../src/types";

interface Props {
  creators: CREATOR_LIST_TYPE[];
  recipes: RECIPE_LIST_TYPE[];
  user: USER_LIST_TYPE;
}

interface Params {
  params: {
    username: string;
  };
}

function UserCooklist(props: Props) {
  const { creators, recipes, user } = props;
  const title = `${user.profile.name}'s Likes • Savry`;
  const recipeHeader = `${user.profile.name} LIKED RECIPES`;
  const creatorHeader = `${user.profile.name} LIKED CREATORS`;
  const style = "overline";

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileLinkBar username={user.username} />
        <RecipeList recipes={recipes} header={recipeHeader} style={style} />
        <CreatorList creators={creators} header={creatorHeader} style={style} />
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
  const creators = getAllCreators().filter((creator) =>
    user?.liked?.creators?.includes(creator.link)
  );
  const recipes = getAllRecipes().filter((recipe) =>
    user?.liked?.recipes?.includes(recipe.name)
  );

  return {
    props: {
      creators,
      recipes,
      user,
    },
    revalidate: 1800,
  };
}

export default UserCooklist;
