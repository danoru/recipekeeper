import Head from "next/head";
import Image from "next/image";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import RecipeActionBar from "../../src/components/recipes/RecipeActionBar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getAllRecipes, getRecipeId } from "../../src/data/recipes";

interface Params {
  params: {
    slug: string;
  };
}

function RecipePage({ recipe }: { recipe: any }) {
  const title = recipe.name + " by " + recipe.creator + " • Savry";
  const rating: number = recipe.rating / recipe.reviews;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Created with NextJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack
        direction="row"
        sx={{ justifyContent: "center", marginTop: "2vh" }}
      >
        <Image
          src={recipe.image}
          height="300"
          width="235"
          alt={recipe.name}
          style={{ borderRadius: "5%", marginRight: "2vw" }}
        />
        <div style={{ maxWidth: "50%", marginRight: "2vw" }}>
          <Typography variant="h6">{recipe.name}</Typography>
          <Typography variant="body1">
            by{" "}
            <Link href={`/creators/${recipe.creatorId}`}>{recipe.creator}</Link>
          </Typography>

          <Typography variant="body1">{recipe.description}</Typography>
          <Rating value={rating} precision={0.5} readOnly />
          <Typography variant="body1">
            <strong>Ratings:</strong> {rating}/5 Stars based on {recipe.reviews}{" "}
            Reviews
          </Typography>
        </div>
        <RecipeActionBar recipe={recipe} />
      </Stack>
    </div>
  );
}

export async function getStaticPaths() {
  const recipes = getAllRecipes();
  const paths = recipes.map((recipe) => ({
    params: { slug: [recipe.name.replace(/\s+/g, "-").toLowerCase()] },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const { slug } = params;

  const recipe = getRecipeId(slug[0].replace(/-/g, " "));

  if (!recipe) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      recipe,
    },
    revalidate: 1800,
  };
}

export default RecipePage;
