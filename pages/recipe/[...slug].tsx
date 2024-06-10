import Head from "next/head";
import Image from "next/image";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import RecipeActionBar from "../../src/components/recipes/RecipeActionBar";
import RecipeRatings from "../../src/components/recipes/RecipeRatings";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getAllRecipes, getRecipeId } from "../../src/data/recipes";
import { getAllUsers } from "../../src/data/users";
import { RECIPE_LIST_TYPE, USER_LIST_TYPE } from "../../src/types";

interface Params {
  params: {
    slug: string;
  };
}

interface Props {
  recipe: RECIPE_LIST_TYPE;
  slug: string;
  users: USER_LIST_TYPE[];
}

function RecipePage({ recipe, slug, users }: Props) {
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
        <Stack direction="column" maxWidth="15%">
          <RecipeActionBar recipe={recipe} />
          <RecipeRatings slug={slug} users={users} />
        </Stack>
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
  const users = getAllUsers();

  if (!recipe) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      recipe,
      slug,
      users,
    },
    revalidate: 1800,
  };
}

export default RecipePage;
