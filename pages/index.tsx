import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import LoggedInHomePage from "@/components/home/LoggedInHomePage";
import LoggedOutHomePage from "@/components/home/LoggedOutHomePage";
import { getTopLikedCreators } from "@/data/creators";
import { getDiaryEntriesByUsernames } from "@/data/diary";
import { getTopLikedRecipes } from "@/data/recipes";
import { serialize } from "@/data/serialize";
import { getFollowingList } from "@/data/users";
import { getSessionFromContext } from "@/lib/auth";

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
  const session = await getSessionFromContext(context);

  if (session) {
    const following = await getFollowingList(Number(session.user.id));

    const [recentEntries, topLikedCreators, topLikedRecipes] = await Promise.all([
      getDiaryEntriesByUsernames(following, 6),
      getTopLikedCreators(following),
      getTopLikedRecipes(following),
    ]);

    return {
      props: serialize({
        session,
        recentEntries,
        topLikedCreators,
        topLikedRecipes,
      }),
    };
  }

  return { props: { session: null } };
}
