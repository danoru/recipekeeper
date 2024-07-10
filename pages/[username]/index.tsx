import Grid from "@mui/material/Grid";
import Head from "next/head";
import FavoriteCreators from "../../src/components/users/FavoriteCreators";
import FavoriteRecipes from "../../src/components/users/FavoriteRecipes";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import ProfileStatBar from "../../src/components/users/ProfileStatBar";
import UserActivity from "../../src/components/users/UserActivity";
import UserCooklistPreview from "../../src/components/users/UserCooklistPreview";
import UserRecipeDiary from "../../src/components/users/UserRecipeDiary";
import UserFollowing from "../../src/components/users/UserFollowing";
import UserRatings from "../../src/components/users/UserRatings";
import UserRecentRecipes from "../../src/components/users/UserRecentRecipes";
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
import { getSession } from "next-auth/react";

interface Props {
  user: Users;
  cooklist: (Cooklist & { recipes: Recipes })[];
  diaryEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
  favoriteCreators: (FavoritesCreators & { creators: Creators })[];
  favoriteRecipes: (FavoritesRecipes & { recipes: Recipes })[];
  followers: Following[];
  following: Following[];
  reviews: (Reviews & { users: Users })[];
  sessionUser: any;
}

interface Params {
  username: string;
}

function UserPage({
  user,
  cooklist,
  diaryEntries,
  favoriteCreators,
  favoriteRecipes,
  followers,
  following,
  reviews,
  sessionUser,
}: Props) {
  const title = `${user.username}'s Profile • Savry`;
  const avatarSize = "56px";

  const creators = favoriteCreators.map((fav) => fav.creators);
  const recipes = favoriteRecipes.map((fav) => fav.recipes);

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

export async function getServerSideProps(context: {
  params: Params;
  req: any;
}) {
  const { username } = context.params;
  const session = await getSession({ req: context.req });
  const sessionUser = session?.user || null;

  let cooklist: Cooklist[] = [];
  let diaryEntries: DiaryEntries[] = [];
  let favoriteCreators: FavoritesCreators[] = [];
  let favoriteRecipes: FavoritesRecipes[] = [];
  let followers: Following[] = [];
  let following: Following[] = [];
  let reviews: Reviews[] = [];

  const user = await getUserProfile(username);

  if (user) {
    cooklist = user.cooklist;
    diaryEntries = user.diaryEntries;
    favoriteCreators = user.favoritesCreators;
    favoriteRecipes = user.favoritesRecipes;
    followers = await getFollowers(username);
    following = user.following;
    reviews = user.reviews;
  }

  return {
    props: {
      user,
      cooklist,
      diaryEntries,
      favoriteCreators,
      favoriteRecipes,
      following,
      followers,
      reviews,
      sessionUser,
    },
  };
}

export default UserPage;
