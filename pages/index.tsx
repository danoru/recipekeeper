import Head from "next/head";

function Home() {
  return (
    <div>
      <Head>
        <title>Savry</title>
        <meta name="description" content="Created with NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <div>
            <h2>Track recipes you&apos;ve made.</h2>
            <h2>Save those you want to eat.</h2>
            <h2>Tell your friends what&apos;s good.</h2>
          </div>
        </div>
        <button>GET STARTED — IT&apos;S FREE!</button>
        <p>The social network for food lovers. Not available anywhere else.</p>
      </main>
    </div>
  );
}

export default Home;
