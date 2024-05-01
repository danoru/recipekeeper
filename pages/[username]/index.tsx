import Grid from "@mui/material/Grid";
import Head from "next/head";
import FavoriteCreators from "../../src/components/users/FavoriteCreators";
import FavoriteRecipes from "../../src/components/users/FavoriteRecipes";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import ProfileStatBar from "../../src/components/users/ProfileStatBar";
import UserActivity from "../../src/components/users/UserActivity";
import UserCooklistPreview from "../../src/components/users/UserCooklistPreview";
import UserFollowing from "../../src/components/users/UserFollowing";
import UserRatings from "../../src/components/users/UserRatings";
import UserRecentRecipes from "../../src/components/users/UserRecentRecipes";
import { getAllUsers } from "../../src/data/users";
import { getAllCreators } from "../../src/data/creators";
import { getAllRecipes } from "../../src/data/recipes";
import {
  CREATOR_LIST_TYPE,
  RECIPE_LIST_TYPE,
  USER_LIST_TYPE,
} from "../../src/types";

interface Props {
  user: USER_LIST_TYPE;
  cooklist: RECIPE_LIST_TYPE[];
  creators: CREATOR_LIST_TYPE[];
  favoriteRecipes: RECIPE_LIST_TYPE[];
  recentRecipes: RECIPE_LIST_TYPE[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserPage({
  user,
  cooklist,
  creators,
  favoriteRecipes,
  recentRecipes,
}: Props) {
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
        <UserCooklistPreview cooklist={cooklist} />
        <FavoriteRecipes recipes={favoriteRecipes} />
        <UserRatings user={user} />
        <UserRecentRecipes user={user} recipes={recentRecipes} />
        <UserActivity user={user} />
        <UserFollowing user={user} />
        {/* <Grid item xs={4}>
          Diary
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

export async function getStaticProps({ params }: Params) {
  const { username } = params;
  const user = getAllUsers().find((user) => user.username === username);

  const creators = getAllCreators().filter((creator) =>
    user?.favorites?.creators.includes(creator.link)
  );
  const favoriteRecipes = getAllRecipes().filter((recipe) =>
    user?.favorites?.recipes.includes(recipe.name)
  );
  const recentRecipes = getAllRecipes().filter((recipe) =>
    user?.diary?.some((entry) => entry.recipe.includes(recipe.name))
  );
  const cooklist = getAllRecipes().filter((recipe) =>
    user?.cooklist?.includes(recipe.name)
  );

  return {
    props: {
      cooklist,
      creators,
      favoriteRecipes,
      recentRecipes,
      user,
    },
    revalidate: 1800,
  };
}

export default UserPage;
