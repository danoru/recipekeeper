import Head from "next/head";
import LoggedInHomePage from "../src/components/home/LoggedInHomePage";
import LoggedOutHomePage from "../src/components/home/LoggedOutHomePage";
import { serializePrisma } from "../src/data/helpers";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getTopLikedRecipes } from "../src/data/recipes";
import { getTopLikedCreators } from "../src/data/creators";
import { getFollowingList } from "../src/data/users";
import { getDiaryEntriesByUsernames } from "../src/data/diary";

export default function Home({
  recentEntries,
  session,
  topLikedCreators,
  topLikedRecipes,
}: any) {
  const username = session?.user?.username;
  return (
    <>
      <Head>
        <title>Savry</title>
        <meta name="description" content="Track recipes you've made." />
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

  if (session) {
    const sessionUserId = parseInt(session.user.id);
    const following = await getFollowingList(sessionUserId);

    const [recentEntries, topLikedCreators, topLikedRecipes] =
      await Promise.all([
        getDiaryEntriesByUsernames(following),
        getTopLikedCreators(sessionUserId),
        getTopLikedRecipes(sessionUserId),
      ]);

    return {
      props: serializePrisma({
        recentEntries,
        session,
        topLikedCreators,
        topLikedRecipes,
      }),
    };
  }

  return { props: { session } };
}
