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
  let allCreators = getAllCreators();
  let filteredCreators = getFilteredCreators();

  return {
    props: {
      creators: allCreators,
      featured: filteredCreators,
    },
    revalidate: 1800,
  };
}

export default Creators;
