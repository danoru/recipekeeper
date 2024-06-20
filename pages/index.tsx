import Head from "next/head";
import LoggedInHomePage from "../src/components/home/LoggedInHomePage";
import LoggedOutHomePage from "../src/components/home/LoggedOutHomePage";
import superjson from "superjson";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getTopLikedRecipes } from "../src/data/recipes";
import { getTopLikedCreators } from "../src/data/creators";
import { findUserByUserId } from "../src/data/users";
import { getRecentDiaryEntries } from "../src/data/diary";
import { Creators, DiaryEntries, Recipes, Users } from "@prisma/client";

interface Props {
  recentEntries: (DiaryEntries & { users: Users })[];
  session: any;
  sessionUser: Users;
  topLikedCreators: Creators[];
  topLikedRecipes: Recipes[];
}

function Home({
  recentEntries,
  session,
  sessionUser,
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
          sessionUser={sessionUser}
        />
      ) : (
        <LoggedOutHomePage />
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  let sessionUser: Users | null = null;
  let recentEntries;
  let topLikedCreators;
  let topLikedRecipes;

  if (session) {
    const sessionUserId = parseInt(session.user.id);
    sessionUser = await findUserByUserId(sessionUserId);

    if (sessionUser) {
      recentEntries = await getRecentDiaryEntries(sessionUserId);
      topLikedCreators = await getTopLikedCreators(sessionUserId);
      topLikedRecipes = await getTopLikedRecipes(sessionUserId);
    }

    return {
      props: superjson.serialize({
        recentEntries,
        session,
        sessionUser,
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
