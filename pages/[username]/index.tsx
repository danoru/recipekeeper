import Grid from "@mui/material/Grid";
import Head from "next/head";
import FavoriteCreators from "../../src/components/users/FavoriteCreators";
import FavoriteRecipes from "../../src/components/users/FavoriteRecipes";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import ProfileStatBar from "../../src/components/users/ProfileStatBar";
import UserCooklistPreview from "../../src/components/users/UserCooklistPreview";
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
  cooklist: RECIPE_LIST_TYPE[];
  creators: CREATOR_LIST_TYPE[];
  recipes: RECIPE_LIST_TYPE[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserPage(props: Props) {
  const { user, cooklist, creators, recipes } = props;
  const title = `${user.profile.name}'s Profile • Savry`;
  const avatarSize = "56px";

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileStatBar avatarSize={avatarSize} user={user} />
        <ProfileLinkBar username={user.username} />
        <FavoriteCreators creators={creators} />
        <Grid item xs={4}>
          <UserCooklistPreview cooklist={cooklist} />
        </Grid>
        <FavoriteRecipes recipes={recipes} />
        {/* <Grid item xs={4}>
          Ratings
        </Grid>
        <Grid item xs={8}>
          Recent Activity
        </Grid> */}
        {/* <Grid item xs={8}>
          Following
        </Grid>
        <Grid item xs={4}>
          Diary
        </Grid>
        <Grid item xs={4}>
          Activity
        </Grid>
         */}
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
    user?.favorites?.creators.includes(creator.link)
  );
  const recipes = getAllRecipes().filter((recipe) =>
    user?.favorites?.recipes.includes(recipe.name)
  );

  const cooklist = getAllRecipes().filter((recipe) =>
    user?.cooklist?.includes(recipe.name)
  );

  return {
    props: {
      cooklist,
      creators,
      recipes,
      user,
    },
    revalidate: 1800,
  };
}

export default UserPage;
