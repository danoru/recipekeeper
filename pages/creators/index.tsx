import Head from "next/head";

import CreatorCarousel from "../../src/components/creators/CreatorCarousel";
import { getFeaturedCreators } from "../../src/data/creators";

function Creators(props: any) {
  const { creators } = props;

  return (
    <div>
      <Head>
        <title>Creators • Savry</title>
      </Head>
      <CreatorCarousel creators={creators} />
    </div>
  );
}

export async function getStaticProps() {
  let featuredCreators = getFeaturedCreators();

  return {
    props: {
      creators: featuredCreators,
    },
    revalidate: 1800,
  };
}

export default Creators;
