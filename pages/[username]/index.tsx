import Box from "@mui/material/Box";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import SocialMeta from "@/components/ui/SocialMeta";
import CookingHeatmap from "@/components/users/CookingHeatmap";
import FavoriteCreators from "@/components/users/FavoriteCreators";
import FavoriteRecipes from "@/components/users/FavoriteRecipes";
import ProfileLinkBar from "@/components/users/ProfileLinkBar";
import ProfileStatBar from "@/components/users/ProfileStatBar";
import TasteMatch from "@/components/users/TasteMatch";
import UserCooklistPreview from "@/components/users/UserCooklistPreview";
import UserFollowing from "@/components/users/UserFollowing";
import UserRatings from "@/components/users/UserRatings";
import UserRecentRecipes from "@/components/users/UserRecentRecipes";
import UserRecipeDiary from "@/components/users/UserRecipeDiary";
import { getUserRatings } from "@/data/diary";
import { serialize } from "@/data/serialize";
import { getFollowers, getUserProfile } from "@/data/users";
import { getSessionFromContext } from "@/lib/auth";
import { siteUrl } from "@/lib/site";
import { cookingActivity, ratingAgreement } from "@/lib/stats";

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
  activity,
  tasteMatch,
  ogImage,
}: any) {
  const title = `${user.username}'s Profile • Savry`;
  const creators = favoritesCreators.map((f: any) => f.creators);
  const recipes = favoritesRecipes.map((f: any) => f.recipes);

  return (
    <>
      <SocialMeta
        description={`See what ${user.username} has been cooking on Savry.`}
        image={ogImage}
        title={`${user.username} on Savry`}
      />
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
          followers={followers}
          following={following}
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
            <CookingHeatmap activity={activity} />
            <FavoriteCreators creators={creators} />
            <FavoriteRecipes recipes={recipes} />
            <UserRecentRecipes diaryEntries={diaryEntries} />
            <UserFollowing following={following} />
          </Box>

          {/* Sidebar */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {tasteMatch && <TasteMatch match={tasteMatch} username={user.username} />}
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

  const [session, user, followers] = await Promise.all([
    getSessionFromContext(context),
    getUserProfile(username),
    getFollowers(username),
  ]);
  if (!user) return { notFound: true };

  const { cooklist, diaryEntries, favoritesCreators, favoritesRecipes, following, reviews } = user;

  const activity = cookingActivity(diaryEntries, new Date());

  // Taste match: only when a signed-in viewer looks at someone else.
  const viewerId = Number(session?.user.id);
  let tasteMatch = null;
  if (session && viewerId !== user.id) {
    const viewerRatings = await getUserRatings(viewerId);
    const profileRatings = diaryEntries.map((e) => ({
      recipeId: e.recipeId,
      rating: e.rating.toNumber(),
    }));
    tasteMatch = ratingAgreement(viewerRatings, profileRatings);
  }

  return {
    props: serialize({
      user,
      cooklist,
      diaryEntries,
      favoritesCreators,
      favoritesRecipes,
      following,
      followers,
      reviews,
      sessionUser: session?.user ?? null,
      activity,
      tasteMatch,
      ogImage: `${siteUrl()}/api/og/profile/${encodeURIComponent(user.username)}`,
    }),
  };
}
