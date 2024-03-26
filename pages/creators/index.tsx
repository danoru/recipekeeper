import Head from "next/head";

import CreatorCarousel from "../../src/components/creators/CreatorCarousel";
import CreatorList from "../../src/components/creators/CreatorList";
import { getAllCreators, getFilteredCreators } from "../../src/data/creators";

function Creators(props: any) {
  const { creators, featured } = props;

  return (
    <div>
      <Head>
        <title>Creators • Savry</title>
      </Head>
      <CreatorCarousel creators={featured} />
      <CreatorList creators={creators} />
    </div>
  );
}

export async function getStaticProps() {
  const dev = process.env.NODE_ENV !== "production";
  const { DEV_URL, PROD_URL } = process.env;

  const allRes = await fetch(`${dev ? DEV_URL : PROD_URL}/api/creators`);
  const featRes = await fetch(
    `${dev ? DEV_URL : PROD_URL}/api/creators/featured`
  );
  const allCreators = await allRes.json();
  const featuredCreators = await featRes.json();

  return {
    props: {
      creators: allCreators,
      featured: featuredCreators,
    },
    revalidate: 1800,
  };
}

export default Creators;
