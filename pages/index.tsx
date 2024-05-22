import Head from "next/head";
import LoggedInHomePage from "../src/components/home/LoggedInHomePage";
import LoggedOutHomePage from "../src/components/home/LoggedOutHomePage";
import { getSession } from "next-auth/react";
import { getAllCreators } from "../src/data/creators";
import { getAllRecipes } from "../src/data/recipes";
import { findUserByUsername } from "../src/data/users";

function Home({ creators, recipes, session, sessionUser }: any) {
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
          creators={creators}
          recipes={recipes}
          username={username}
          sessionUser={sessionUser}
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
  const creators = getAllCreators();
  let sessionUser = null;

  if (session) {
    const sessionUsername = session.user.username;
    sessionUser = findUserByUsername(sessionUsername);
  }

  return {
    props: {
      creators,
      recipes,
      session,
      sessionUser,
    },
  };
}

export default Home;
