import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";

import StarRating from "../../../src/components/ui/StarRating";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import { recipeHref } from "../../../src/data/helpers";
import { getUserReviews } from "../../../src/data/reviews";
import { findUserByUsername, getAllUsers } from "../../../src/data/users";


interface SerializedReview {
  id: number;
  rating: number;
  date: string;
  comment: string | null;
  recipes: {
    name: string;
    image: string;
    creators: { name: string; [key: string]: any };
    [key: string]: any;
  };
}

interface Props {
  user: any;
  reviews: SerializedReview[];
}

export default function UserRecipeReviews({ user, reviews }: Props) {
  const title = `${user.username}'s Reviews • Savry`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "720px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: 4,
          pb: 12,
        }}
      >
        <ProfileLinkBar username={user.username} />

        <Box sx={{ mt: 4 }}>
          {reviews.length === 0 ? (
            <Typography sx={{ fontSize: "0.875rem", color: "text.disabled" }}>
              No reviews yet.
            </Typography>
          ) : (
            <Stack divider={<Divider />} spacing={0}>
              {reviews.map((review) => {
                const recipeName = review.recipes?.name ?? "";
                const creatorName = review.recipes?.creators?.name ?? "";
                const href = recipeHref(creatorName, recipeName);

                return (
                  <Box
                    key={review.id}
                    sx={{
                      display: "flex",
                      gap: 2,
                      py: 2.5,
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#1a1a1a" },
                      borderRadius: "6px",
                      px: 1,
                    }}
                  >
                    {/* Recipe thumbnail */}
                    <Box
                      component={NextLink}
                      href={href}
                      sx={{
                        flexShrink: 0,
                        width: 72,
                        height: 72,
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.07)",
                        bgcolor: "#1e1e1e",
                        position: "relative",
                        display: "block",
                      }}
                    >
                      <Image
                        fill
                        alt={recipeName}
                        sizes="72px"
                        src={review.recipes.image}
                        style={{ objectFit: "cover" }}
                      />
                    </Box>

                    {/* Review content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <MuiLink
                        component={NextLink}
                        href={href}
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1rem",
                          color: "text.primary",
                          display: "block",
                          mb: 0.5,
                          "&:hover": { color: "primary.main" },
                        }}
                        underline="none"
                      >
                        {recipeName}
                      </MuiLink>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 0.75,
                        }}
                      >
                        <StarRating rating={review.rating} size="sm" />
                        <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
                          {dayjs(review.date).format("MMM D, YYYY")}
                        </Typography>
                      </Box>

                      {review.comment && (
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            color: "text.secondary",
                            lineHeight: 1.6,
                          }}
                        >
                          {review.comment}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const users = await getAllUsers();
  return {
    paths: users.map((u) => ({ params: { username: u.username } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await findUserByUsername(username);
  if (!user) return { notFound: true };

  const reviews = await getUserReviews(user.id);

  return {
    props: { reviews, user },
    revalidate: 1800,
  };
}
