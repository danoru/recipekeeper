import Head from "next/head";
import BrowseBar from "../../src/components/recipes/BrowseBar";
import PopCarousel from "../../src/components/recipes/PopCarousel";

function Recipes() {
  return (
    <div>
      <Head>
        <title>Recipes • Savry</title>
      </Head>
      <main>
        <BrowseBar />
        <PopCarousel />
        <div></div>
        {/* Just Reviewed */}
        <div></div>
        {/* Popular Reviews This Week */}
        <div></div>
        {/* Crew Picksl */}
        <div></div>
        {/* Popular Reviewers */}
        <div></div>
      </main>
    </div>
  );
}

export default Recipes;
