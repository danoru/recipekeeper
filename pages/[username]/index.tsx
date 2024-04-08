import Grid from "@mui/material/Grid";
import Head from "next/head";
import FavoriteCreators from "../../src/components/users/FavoriteCreators";
import FavoriteRecipes from "../../src/components/users/FavoriteRecipes";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import ProfileStatBar from "../../src/components/users/ProfileStatBar";
import { getAllUsers } from "../../src/data/users";
import {
  CREATOR_LIST_TYPE,
  RECIPE_LIST_TYPE,
  USER_LIST_TYPE,
} from "../../src/types";
import { getAllCreators } from "../../src/data/creators";
import { getAllRecipes } from "../../src/data/recipes";

interface Props {
  user: USER_LIST_TYPE;
  creators: CREATOR_LIST_TYPE[];
  recipes: RECIPE_LIST_TYPE[];
}

function UserPage(props: Props) {
  const { user, creators, recipes } = props;
  const title = `${user.profile.name}'s Profile • Savry`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileStatBar />
        <ProfileLinkBar />
        <FavoriteCreators creators={creators} />
        {/* <Grid item xs={4}>
          Cooklist
        </Grid> */}
        <FavoriteRecipes recipes={recipes} />
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

  const creators = getAllCreators().filter((creator) =>
    user?.favorites?.creators.includes(creator.link)
  );
  const recipes = getAllRecipes().filter((recipe) =>
    user?.favorites?.recipes.includes(recipe.name)
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

export default UserPage;
