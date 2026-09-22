import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import LoggedInHomePage from "@/components/home/LoggedInHomePage";
import LoggedOutHomePage from "@/components/home/LoggedOutHomePage";
import { getTopLikedCreators } from "@/data/creators";
import { getCookAgain, getDiaryEntriesByUsernames, getYearSnapshot } from "@/data/diary";
import { getTopLikedRecipes } from "@/data/recipes";
import { serialize } from "@/data/serialize";
import { getFollowingList } from "@/data/users";
import { getSessionFromContext } from "@/lib/auth";

export default function Home({
  cookAgain,
  recentEntries,
  session,
  topLikedCreators,
  topLikedRecipes,
  yearSnapshot,
}: any) {
  const username = session?.user?.username;

  return (
    <>
      <Head>
        <title>Savry</title>
        <meta content="Track recipes you've made." name="description" />
      </Head>
      {session ? (
        <LoggedInHomePage
          cookAgain={cookAgain}
          creators={topLikedCreators}
          recentEntries={recentEntries}
          recipes={topLikedRecipes}
          username={username}
          yearSnapshot={yearSnapshot}
        />
      ) : (
        <LoggedOutHomePage />
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionFromContext(context);

  if (session) {
    const userId = Number(session.user.id);
    const following = await getFollowingList(userId);

    const [recentEntries, topLikedCreators, topLikedRecipes, cookAgain, yearSnapshot] =
      await Promise.all([
        getDiaryEntriesByUsernames(following, 6),
        getTopLikedCreators(following),
        getTopLikedRecipes(following),
        getCookAgain(userId),
        getYearSnapshot(userId, session.user.username),
      ]);

    return {
      props: serialize({
        session,
        recentEntries,
        topLikedCreators,
        topLikedRecipes,
        cookAgain,
        yearSnapshot,
      }),
    };
  }

  return { props: { session: null } };
}
