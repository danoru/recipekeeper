import CreatorList from "../../src/components/creators/CreatorList";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import RecipeList from "../../src/components/recipes/RecipeList";
import { getAllCreators } from "../../src/data/creators";
import { getAllRecipes } from "../../src/data/recipes";
import { getAllUsers, getUserLikes } from "../../src/data/users";
import {
  Creators,
  LikedCreators,
  LikedRecipes,
  Recipes,
  Users,
} from "@prisma/client";

interface Props {
  user: Users & {
    likedCreators: (LikedCreators & {
      creators: Creators;
    })[];
    likedRecipes: (LikedRecipes & {
      recipes: Recipes;
    })[];
  };
}

interface Params {
  params: {
    username: string;
  };
}

function UserCooklist({ user }: Props) {
  const title = `${user.username}'s Likes • Savry`;
  const creatorHeader = `${user.username}'S LIKED CREATORS`;
  const creators = user.likedCreators.map((user) => user.creators);
  const recipeHeader = `${user.username}'S LIKED RECIPES`;
  const recipes = user.likedRecipes.map((user) => user.recipes);
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
  const user = await getUserLikes(username);
  return {
    props: {
      user,
    },
    revalidate: 1800,
  };
}

export default UserCooklist;
