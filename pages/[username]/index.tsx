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
  PrismaClient,
  Recipes,
  Reviews,
  Users,
} from "@prisma/client";
import { getFavoriteCreators } from "../../src/data/creators";
import { getUserDiaryEntries } from "../../src/data/diary";
import { getAllUsers, getFollowers, getFollowing } from "../../src/data/users";
import { getCooklist, getFavoriteRecipes } from "../../src/data/recipes";
import { getUserReviews } from "../../src/data/reviews";

interface Props {
  user: Users;
  cooklist: (Cooklist & { recipes: Recipes })[];
  diaryEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
  favoriteCreators: (FavoritesCreators & { creators: Creators })[];
  favoriteRecipes: (FavoritesRecipes & { recipes: Recipes })[];
  followers: Following[];
  following: Following[];
  reviews: (Reviews & { users: Users })[];
}

interface Params {
  params: {
    username: string;
  };
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
      <Grid container></Grid>
      <Grid container>
        <ProfileStatBar
          avatarSize={avatarSize}
          diaryEntries={diaryEntries}
          following={following}
          followers={followers}
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
  const prisma = new PrismaClient();
  const { username } = params;

  let cooklist: Cooklist[] = [];
  let diaryEntries: DiaryEntries[] = [];
  let favoriteCreators: FavoritesCreators[] = [];
  let favoriteRecipes: FavoritesRecipes[] = [];
  let followers: Following[] = [];
  let following: Following[] = [];
  let reviews: Reviews[] = [];
  let usernames: string[] = [];

  const user = await prisma.users.findUnique({
    where: { username },
    include: { reviews: true },
  });

  if (user) {
    cooklist = await getCooklist(user.id);
    diaryEntries = await getUserDiaryEntries(user.id);
    favoriteCreators = await getFavoriteCreators(user.id);
    favoriteRecipes = await getFavoriteRecipes(user.id);
    followers = await getFollowers(username);
    following = await getFollowing(user.id);
    reviews = await getUserReviews(user.id);
    usernames = following.map((user) => user.followingUsername);
    usernames.push(username);
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
    },
    revalidate: 1800,
  };
}

export default UserPage;
