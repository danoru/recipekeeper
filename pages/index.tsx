import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import superjson from "superjson";

import LoggedInHomePage from "../src/components/home/LoggedInHomePage";
import LoggedOutHomePage from "../src/components/home/LoggedOutHomePage";
import { getTopLikedCreators } from "../src/data/creators";
import { getDiaryEntriesByUsernames } from "../src/data/diary";
import { getTopLikedRecipes } from "../src/data/recipes";
import { getFollowingList } from "../src/data/users";


export default function Home({ recentEntries, session, topLikedCreators, topLikedRecipes }: any) {
  const username = session?.user?.username;

  return (
    <>
      <Head>
        <title>Savry</title>
        <meta content="Track recipes you've made." name="description" />
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
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  console.log(session);

  if (session) {
    const sessionUserId = Number(session.user?.id);
    const following = await getFollowingList(sessionUserId);

    const [recentEntries, topLikedCreators, topLikedRecipes] = await Promise.all([
      getDiaryEntriesByUsernames(following),
      getTopLikedCreators(sessionUserId),
      getTopLikedRecipes(sessionUserId),
    ]);

    return {
      props: superjson.serialize({
        session,
        recentEntries,
        topLikedCreators,
        topLikedRecipes,
      }).json,
    };
  }

  return { props: { session } };
}
