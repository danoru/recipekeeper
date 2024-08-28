import Head from "next/head";
import LoggedInHomePage from "../src/components/home/LoggedInHomePage";
import LoggedOutHomePage from "../src/components/home/LoggedOutHomePage";
import superjson from "superjson";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getTopLikedRecipes } from "../src/data/recipes";
import { getTopLikedCreators } from "../src/data/creators";
import { findUserByUserId, getFollowing } from "../src/data/users";
import { getDiaryEntriesByUsernames } from "../src/data/diary";
import { Creators, DiaryEntries, Recipes, Users } from "@prisma/client";

interface Props {
  recentEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
  session: any;
  topLikedCreators: Creators[];
  topLikedRecipes: Recipes[];
}

function Home({
  recentEntries,
  session,
  topLikedCreators,
  topLikedRecipes,
}: Props) {
  const username = session?.user?.username;

  return (
    <div>
      <Head>
        <title>Savry</title>
        <meta name="description" content="Created with NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session ? (
        <LoggedInHomePage
          creators={topLikedCreators}
          recentEntries={recentEntries}
          recipes={topLikedRecipes}
          username={username}
        />
      ) : (
        <LoggedOutHomePage />
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    const sessionUserId = parseInt(session.user.id);
    const following = await getFollowing(sessionUserId);
    const followingList = following.map((user) => user.followingUsername);
    const [recentEntries, topLikedCreators, topLikedRecipes] =
      await Promise.all([
        getDiaryEntriesByUsernames(followingList),
        getTopLikedCreators(sessionUserId),
        getTopLikedRecipes(sessionUserId),
      ]);

    return {
      props: superjson.serialize({
        recentEntries,
        session,
        topLikedCreators,
        topLikedRecipes,
      }).json,
    };
  }
  return {
    props: { session },
  };
}

export default Home;
