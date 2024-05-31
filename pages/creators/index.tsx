import Head from "next/head";

import CreatorCarousel from "../../src/components/creators/CreatorCarousel";
import CreatorList from "../../src/components/creators/CreatorList";
import { CREATOR_LIST_TYPE } from "../../src/types";

interface Props {
  creators: CREATOR_LIST_TYPE[];
  featured: CREATOR_LIST_TYPE[];
}

function Creators(props: Props) {
  const { creators, featured } = props;
  const header = "All Creators";
  const style = "h6";

  return (
    <div>
      <Head>
        <title>Creators • Savry</title>
      </Head>
      <CreatorCarousel creators={featured} />
      <CreatorList creators={creators} header={header} style={style} />
    </div>
  );
}

export async function getServerSideProps() {
  const { DEV_URL, PROD_URL } = process.env;
  const dev = process.env.NODE_ENV !== "production" ? DEV_URL : PROD_URL;

  const allRes = await fetch(`${dev}/api/creators`);
  const featRes = await fetch(`${dev}/api/creators/featured`);
  const allCreators = await allRes.json();
  const featuredCreators = await featRes.json();

  return {
    props: {
      creators: allCreators,
      featured: featuredCreators,
    },
  };
}

export default Creators;
