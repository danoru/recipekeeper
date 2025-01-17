import Head from "next/head";
import Image from "next/image";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import RecipeActionBar from "../../src/components/recipes/RecipeActionBar";
import RecipeFriendRatings from "../../src/components/recipes/RecipeFriendRatings";
import RecipeRatings from "../../src/components/recipes/RecipeRatings";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Cooklist,
  Creators,
  DiaryEntries,
  LikedRecipes,
  Recipes,
  Reviews,
  Users,
} from "@prisma/client";
import { findUserByUsername, getFollowingList } from "../../src/data/users";
import {
  getCooklist,
  getLikedRecipes,
  getRecipeByName,
} from "../../src/data/recipes";
import { getReviewsByRecipe } from "../../src/data/reviews";
import { getSession } from "next-auth/react";
import { getUserDiaryEntries } from "../../src/data/diary";

interface Params {
  slug: string;
}

interface Props {
  cooklist: Cooklist[];
  diaryEntries: DiaryEntries[];
  likedRecipes: LikedRecipes[];
  recipe: Recipes & { creators: Creators; reviews: Reviews[] };
  reviews: (Reviews & { users: Users })[];
  sessionUser: any;
}

function RecipePage({
  cooklist,
  diaryEntries,
  likedRecipes,
  recipe,
  reviews,
  sessionUser,
}: Props) {
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
          {reviews.length > 0 && <RecipeFriendRatings reviews={reviews} />}
        </div>
        <Stack direction="column" maxWidth="15%">
          <RecipeActionBar
            cooklist={cooklist}
            diaryEntries={diaryEntries}
            likedRecipes={likedRecipes}
            recipe={recipe}
            sessionUser={sessionUser}
          />
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

  console.log(session);

  if (session) {
    const sessionUser = session.user;
    const [recipe, user] = await Promise.all([
      getRecipeByName(slug[0].replace(/-/g, " ")),
      findUserByUsername(sessionUser.username),
    ]);

    if (user && recipe) {
      const [cooklist, diaryEntries, following, likedRecipes] =
        await Promise.all([
          getCooklist(user.id),
          getUserDiaryEntries(user.id),
          getFollowingList(user.id),
          getLikedRecipes(user.id),
        ]);

      const reviews = await getReviewsByRecipe(recipe.id, following);
      if (!recipe) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          cooklist,
          diaryEntries,
          following,
          likedRecipes,
          recipe,
          reviews,
          sessionUser,
        },
      };
    }
  }

  return {
    props: {
      recipe: await getRecipeByName(slug[0].replace(/-/g, " ")),
      reviews: [],
    },
  };
}

export default RecipePage;
