import BrowseBar from "../../src/components/recipes/BrowseBar";
// import CrewPicks from "../../src/components/recipes/CrewPicks";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import PopCarousel from "../../src/components/recipes/PopCarousel";
// import PopularReviews from "../../src/components/reviews/PopularReviews";
// import PopularReviewers from "../../src/components/reviews/PopularReviewers";
// import RecentReviews from "../../src/components/reviews/RecentReviews";

import { getFeaturedRecipes } from "../../src/data/recipes";

function Recipes(props: any) {
  const { recipes } = props;

  return (
    <div>
      <Head>
        <title>Recipes • Savry</title>
      </Head>
      <main>
        <Grid container>
          <BrowseBar />
          <PopCarousel items={recipes} />
          {/* <RecentReviews />
          <PopularReviews />
          <Grid item xs={4}>
            <CrewPicks />
            <PopularReviewers />
          </Grid> */}
        </Grid>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  let featuredRecipes = getFeaturedRecipes();

  return {
    props: {
      recipes: featuredRecipes,
    },
    revalidate: 1800,
  };
}

export default Recipes;
