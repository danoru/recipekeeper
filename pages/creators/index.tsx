import Head from "next/head";
import CreatorCarousel from "../../src/components/creators/CreatorCarousel";
import CreatorList from "../../src/components/creators/CreatorList";
import { getAllCreators, getFeaturedCreators } from "../../src/data/creators";
import { Creators } from "@prisma/client";

interface Props {
  creators: Creators[];
  featured: Creators[];
}

function CreatorsPage({ creators, featured }: Props) {
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
  const allCreators = await getAllCreators();
  const featuredCreators = await getFeaturedCreators();

  return {
    props: {
      creators: allCreators,
      featured: featuredCreators,
    },
  };
}

export default CreatorsPage;
