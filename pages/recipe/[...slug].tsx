import Head from "next/head";
import Image from "next/image";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import RecipeActionBar from "../../src/components/recipes/RecipeActionBar";
import RecipeFriendRatings from "../../src/components/recipes/RecipeFriendRatings";
import RecipeRatings from "../../src/components/recipes/RecipeRatings";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { findUserByUsername, getFollowing } from "../../src/data/users";
import { getRecipeByName } from "../../src/data/recipes";
import { getReviewsByRecipe } from "../../src/data/reviews";
import { getSession } from "next-auth/react";
import { Creators, Recipes, Reviews, Users } from "@prisma/client";

interface Params {
  slug: string;
}

interface Props {
  recipe: Recipes & { creators: Creators; reviews: Reviews[] };
  reviews: (Reviews & { users: Users })[];
}

function RecipePage({ recipe, reviews }: Props) {
  const title = `${recipe.name} by ${recipe.creators.name} • Savry`;
  const totalRating = recipe.reviews.reduce(
    (sum, review) => sum + review.rating.toNumber(),
    0
  );
  const ratingCount = recipe.reviews.length;
  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

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
          priority
        />
        <div style={{ maxWidth: "50%", marginRight: "2vw" }}>
          <Typography variant="h6">{recipe.name}</Typography>
          <Typography variant="body1">
            by{" "}
            <Link href={`/creators/${recipe.creatorId}`}>
              {recipe.creators.name}
            </Link>
          </Typography>

          <Typography variant="body1">{recipe.description}</Typography>
          <Rating value={averageRating} precision={0.5} readOnly />
          <Typography variant="body1">
            <strong>Ratings:</strong> {averageRating}/5 Stars based on{" "}
            {ratingCount} Reviews
          </Typography>
          <RecipeFriendRatings reviews={reviews} />
        </div>
        <Stack direction="column" maxWidth="15%">
          <RecipeActionBar recipe={recipe} />
          <RecipeRatings recipe={recipe} />
        </Stack>
      </Stack>
    </div>
  );
}

export async function getServerSideProps(context: {
  params: Params;
  req: any;
}) {
  const { slug } = context.params;
  const session = await getSession({ req: context.req });

  if (!session || !session.user) {
    return {
      props: {
        recipe: await getRecipeByName(slug[0].replace(/-/g, " ")),
        reviews: [],
      },
    };
  }
  const sessionUser = session.user.username;

  const recipeName = slug[0].replace(/-/g, " ");
  const recipe = await getRecipeByName(recipeName);

  if (!recipe) {
    return {
      notFound: true,
    };
  }

  let reviews: (Reviews & { users: Users })[] = [];

  const user = await findUserByUsername(sessionUser);

  if (user && recipe) {
    const following = await getFollowing(user.id);
    const followingList = following.map((f) => f.followingUsername);

    reviews = await getReviewsByRecipe(recipe.id, followingList);
  }

  return {
    props: {
      recipe,
      reviews,
    },
  };
}

export default RecipePage;
