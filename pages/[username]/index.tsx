import Grid from "@mui/material/Grid";
import Head from "next/head";
import FavoriteCreators from "../../src/components/users/FavoriteCreators";
import FavoriteRecipes from "../../src/components/users/FavoriteRecipes";
import prisma from "../../src/data/db";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import ProfileStatBar from "../../src/components/users/ProfileStatBar";
import UserActivity from "../../src/components/users/UserActivity";
import UserCooklistPreview from "../../src/components/users/UserCooklistPreview";
import UserRecipeDiary from "../../src/components/users/UserRecipeDiary";
import UserFollowing from "../../src/components/users/UserFollowing";
import UserRatings from "../../src/components/users/UserRatings";
import UserRecentRecipes from "../../src/components/users/UserRecentRecipes";
import {
  Prisma,
  // Cooklist,
  // Creators,
  // DiaryEntries,
  // FavoritesCreators,
  // FavoritesRecipes,
  // Following,
  // Recipes,
  // Reviews,
  // Users,
} from "@prisma/client";
import { getFavoriteCreators } from "../../src/data/creators";
import { getUserDiaryEntries } from "../../src/data/diary";
import { getFollowers, getFollowing } from "../../src/data/users";
import { getCooklist, getFavoriteRecipes } from "../../src/data/recipes";
import { getUserReviews } from "../../src/data/reviews";
import { getSession } from "next-auth/react";

// interface Props {
//   user: Users;
//   cooklist: (Cooklist & { recipes: Recipes })[];
//   diaryEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
//   favoriteCreators: (FavoritesCreators & { creators: Creators })[];
//   favoriteRecipes: (FavoritesRecipes & { recipes: Recipes })[];
//   followers: Following[];
//   following: Following[];
//   reviews: (Reviews & { users: Users })[];
//   sessionUser: any;
// }

interface Props {
  user: Prisma.UsersGetPayload<{
    include: { reviews: true };
  }>;
  cooklist: any[];
  diaryEntries: any[];
  favoriteCreators: any[];
  favoriteRecipes: any[];
  followers: any[];
  following: any[];
  reviews: any[];
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

  //   let cooklist: Cooklist[] = [];
  //   let diaryEntries: DiaryEntries[] = [];
  //   let favoriteCreators: FavoritesCreators[] = [];
  //   let favoriteRecipes: FavoritesRecipes[] = [];
  //   let followers: Following[] = [];
  //   let following: Following[] = [];
  //   let reviews: Reviews[] = [];

  //   const user = await prisma.users.findUnique({
  //     where: { username },
  //     include: { reviews: true },
  //   });

  //   if (user) {
  //     cooklist = await getCooklist(user.id);
  //     diaryEntries = await getUserDiaryEntries(user.id);
  //     favoriteCreators = await getFavoriteCreators(user.id);
  //     favoriteRecipes = await getFavoriteRecipes(user.id);
  //     followers = await getFollowers(username);
  //     following = await getFollowing(user.id);
  //     reviews = await getUserReviews(user.id);
  //   }

  //   return {
  //     props: {
  //       user,
  //       cooklist,
  //       diaryEntries,
  //       favoriteCreators,
  //       favoriteRecipes,
  //       following,
  //       followers,
  //       reviews,
  //       sessionUser,
  //     },
  //   };
  // }
  try {
    const user = await prisma.users.findUnique({
      where: { username },
      include: { reviews: true },
    });

    if (!user) {
      return {
        notFound: true,
      };
    }

    const [
      cooklist,
      diaryEntries,
      favoriteCreators,
      favoriteRecipes,
      followers,
      following,
      reviews,
    ] = await Promise.all([
      getCooklist(user.id),
      getUserDiaryEntries(user.id),
      getFavoriteCreators(user.id),
      getFavoriteRecipes(user.id),
      getFollowers(username),
      getFollowing(user.id),
      getUserReviews(user.id),
    ]);

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
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      props: {
        user: null,
        cooklist: [],
        diaryEntries: [],
        favoriteCreators: [],
        favoriteRecipes: [],
        following: [],
        followers: [],
        reviews: [],
        sessionUser,
      },
    };
  }
}

export default UserPage;
