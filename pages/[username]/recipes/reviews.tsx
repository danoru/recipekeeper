import Grid from "@mui/material/Grid";
import Head from "next/head";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import { findUserByUsername, getAllUsers } from "../../../src/data/users";
import { Recipes, Reviews, Users } from "@prisma/client";
import { getUserReviews } from "../../../src/data/reviews";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Image from "next/image";
import moment from "moment";

interface Props {
  user: Users;
  reviews: (Reviews & { recipes: Recipes })[];
}

interface Params {
  params: {
    username: string;
  };
}

function UserRecipeReviews({ user, reviews }: Props) {
  const title = `${user.username}'s Reviews • Savry`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container>
        <ProfileLinkBar username={user.username} />
        <Grid item xs={8}>
          <Stack
            spacing={1}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            {reviews.map((review) => (
              <Stack
                key={review.id}
                direction="row"
                sx={{ alignItems: "center", paddingLeft: "10px" }}
              >
                <div style={{ width: "10%", textAlign: "right" }}>
                  <Link href={`/recipes/${review.recipes.name}`}>
                    <Image
                      src={review.recipes.image}
                      alt={review.recipes.name}
                      width={100}
                      height={100}
                      style={{ borderRadius: "5%" }}
                    />
                  </Link>
                </div>
                <Stack style={{ width: "90%", paddingLeft: "10px" }}>
                  <Link
                    href={`/recipes/${review.recipes.name}`}
                    underline="none"
                  >
                    <Typography variant="h6">{review.recipes.name}</Typography>
                  </Link>
                  <Rating value={review.rating.toNumber()} readOnly />
                  <Typography variant="body2">
                    Cooked on {moment(review.date).format("ll")}
                  </Typography>
                  <Typography variant="body2">{review.comment}</Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getStaticPaths() {
  const users = await getAllUsers();
  const paths = users.map((user) => ({
    params: { username: user.username },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const { username } = params;
  const user = await findUserByUsername(username);
  let reviews: Reviews[] = [];

  if (user) {
    reviews = await getUserReviews(user.id);
  }

  return {
    props: {
      reviews,
      user,
    },
    revalidate: 1800,
  };
}

export default UserRecipeReviews;
