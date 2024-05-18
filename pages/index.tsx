import Head from "next/head";
import LoggedInHomePage from "../src/components/home/LoggedInHomePage";
import LoggedOutHomePage from "../src/components/home/LoggedOutHomePage";
import { getSession } from "next-auth/react";
import { getAllRecipes } from "../src/data/recipes";
import {
  findUserByUsername,
  getAllUsers,
  getFollowingDiaryEntries,
  getRecentDiaryEntries,
} from "../src/data/users";

function Home({ recipes, session, recentEntries }: any) {
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
          recentEntries={recentEntries}
          recipes={recipes}
          username={username}
        />
      ) : (
        <LoggedOutHomePage />
      )}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const recipes = getAllRecipes();
  const users = getAllUsers();

  let recentEntries = [];

  if (session) {
    const sessionUsername = session.user.username;
    const sessionUser = findUserByUsername(sessionUsername);

    if (sessionUser) {
      const followingList = sessionUser.following ?? [];
      const allDiaryEntries = getFollowingDiaryEntries(followingList);
      recentEntries = getRecentDiaryEntries(allDiaryEntries, 5).map(
        (entry) => ({
          ...entry,
          username: entry.username,
        })
      );
    }
  }

  return {
    props: {
      recentEntries,
      recipes,
      session,
    },
  };
}

export default Home;
