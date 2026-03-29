import Box from "@mui/material/Box";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import { getFollowers, getUserProfile } from "../../src/data/users";
import { serializePrisma } from "../../src/data/helpers";
import { GetServerSidePropsContext } from "next";
import ProfileStatBar from "../../src/components/users/ProfileStatBar";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import FavoriteCreators from "../../src/components/users/FavoriteCreators";
import FavoriteRecipes from "../../src/components/users/FavoriteRecipes";
import {
  UserFollowing,
  UserRatings,
  UserRecentRecipes,
  UserRecipeDiary,
} from "../../src/components/users/UserProfileWidgets";
import UserCooklistPreview from "../../src/components/users/UserCooklistPreview";

export default function UserPage({
  user,
  cooklist,
  diaryEntries,
  favoritesCreators,
  favoritesRecipes,
  followers,
  following,
  reviews,
  sessionUser,
}: any) {
  const title = `${user.username}'s Profile • Savry`;
  const creators = favoritesCreators.map((f: any) => f.creators);
  const recipes = favoritesRecipes.map((f: any) => f.recipes);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 4,
          pb: 12,
        }}
      >
        <ProfileStatBar
          avatarSize="56px"
          diaryEntries={diaryEntries}
          following={following}
          followers={followers}
          sessionUser={sessionUser}
          user={user}
        />
        <ProfileLinkBar username={user.username} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
            gap: 4,
            mt: 4,
            alignItems: "start",
          }}
        >
          {/* Main column */}
          <Box
            sx={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <FavoriteCreators creators={creators} />
            <FavoriteRecipes recipes={recipes} />
            <UserRecentRecipes diaryEntries={diaryEntries} />
            <UserFollowing following={following} />
          </Box>

          {/* Sidebar */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <UserCooklistPreview cooklist={cooklist} />
            <UserRecipeDiary diaryEntries={diaryEntries} />
            <UserRatings reviews={reviews} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { username } = context.params as { username: string };
  const session = await getSession(context);
  const sessionUser = session?.user ?? null;

  const user = await getUserProfile(username);
  if (!user) return { notFound: true };

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
    props: serializePrisma({
      user,
      cooklist,
      diaryEntries,
      favoritesCreators,
      favoritesRecipes,
      following,
      followers,
      reviews,
      sessionUser,
    }),
  };
}
