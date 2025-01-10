import Grid from "@mui/material/Grid";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import {
  Cooklist,
  Creators,
  DiaryEntries,
  FavoritesCreators,
  FavoritesRecipes,
  Following,
  Recipes,
  Reviews,
  Users,
} from "@prisma/client";

import { getFollowers, getUserProfile } from "../../src/data/users";
import { GetServerSidePropsContext } from "next";

const FavoriteCreators = dynamic(
  () => import("../../src/components/users/FavoriteCreators")
);
const FavoriteRecipes = dynamic(
  () => import("../../src/components/users/FavoriteRecipes")
);
const ProfileLinkBar = dynamic(
  () => import("../../src/components/users/ProfileLinkBar")
);
const ProfileStatBar = dynamic(
  () => import("../../src/components/users/ProfileStatBar")
);
const UserActivity = dynamic(
  () => import("../../src/components/users/UserActivity")
);
const UserCooklistPreview = dynamic(
  () => import("../../src/components/users/UserCooklistPreview")
);
const UserRecipeDiary = dynamic(
  () => import("../../src/components/users/UserRecipeDiary")
);
const UserFollowing = dynamic(
  () => import("../../src/components/users/UserFollowing")
);
const UserRatings = dynamic(
  () => import("../../src/components/users/UserRatings")
);
const UserRecentRecipes = dynamic(
  () => import("../../src/components/users/UserRecentRecipes")
);

interface Props {
  user: Users;
  cooklist: (Cooklist & { recipes: Recipes })[];
  diaryEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
  favoritesCreators: (FavoritesCreators & { creators: Creators })[];
  favoritesRecipes: (FavoritesRecipes & { recipes: Recipes })[];
  followers: Following[];
  following: Following[];
  reviews: (Reviews & { users: Users })[];
  sessionUser: any;
}

function UserPage({
  user,
  cooklist,
  diaryEntries,
  favoritesCreators,
  favoritesRecipes,
  followers,
  following,
  reviews,
  sessionUser,
}: Props) {
  const title = `${user.username}'s Profile • Savry`;
  const avatarSize = "56px";

  const creators = favoritesCreators.map((fav) => fav.creators);
  const recipes = favoritesRecipes.map((fav) => fav.recipes);

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container spacing={2}>
        <ProfileStatBar
          avatarSize={avatarSize}
          diaryEntries={diaryEntries}
          following={following}
          followers={followers}
          sessionUser={sessionUser}
          user={user}
        />
        <ProfileLinkBar username={user.username} />
        <Grid item xs={8}>
          <FavoriteCreators creators={creators} />
          <FavoriteRecipes recipes={recipes} />
          <UserRecentRecipes diaryEntries={diaryEntries} />
          <UserFollowing following={following} />
        </Grid>
        <Grid item xs={4}>
          <UserCooklistPreview cooklist={cooklist} />
          <UserRecipeDiary diaryEntries={diaryEntries} />
          <UserRatings reviews={reviews} />
          <UserActivity diaryEntries={diaryEntries} />
        </Grid>
      </Grid>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { username } = context.params as { username: string };
  const session = await getSession(context);
  const sessionUser = session?.user || null;

  const user = await getUserProfile(username);

  if (!user) {
    return {
      notFound: true,
    };
  }

  const followers = await getFollowers(username);
  const {
    cooklist,
    diaryEntries,
    favoritesCreators,
    favoritesRecipes,
    following,
    reviews,
  } = user;

  return {
    props: {
      user,
      cooklist,
      diaryEntries,
      favoritesCreators,
      favoritesRecipes,
      following,
      followers,
      reviews,
      sessionUser,
    },
  };
}

export default UserPage;
