import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Head from "next/head";

import CreatorCard from "@/components/cards/CreatorCard";
import RecipeList from "@/components/recipes/RecipeList";
import SectionHeader from "@/components/ui/SectionHeader";
import ProfileLinkBar from "@/components/users/ProfileLinkBar";
import { creatorHref } from "@/data/helpers";
import { serialize } from "@/data/serialize";
import { getUserLikes } from "@/data/users";

interface Props {
  user: any;
}

export default function UserLikes({ user }: Props) {
  const title = `${user.username}'s Likes • Savry`;
  const creators = user.likedCreators.map((lc: any) => lc.creators);
  const recipes = user.likedRecipes.map((lr: any) => lr.recipes);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 4,
          pb: 12,
        }}
      >
        <ProfileLinkBar username={user.username} />

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 6 }}>
          {recipes.length > 0 && (
            <RecipeList header={`${user.username}'s liked recipes`} recipes={recipes} />
          )}

          {creators.length > 0 && (
            <Box>
              <SectionHeader label={`${user.username}'s liked creators`} />
              <Grid container spacing={1.5}>
                {creators.map((creator: any, i: number) => (
                  <Grid key={i} size={{ md: 3, sm: 4, xs: 6 }}>
                    <CreatorCard
                      image={creator.image}
                      link={creatorHref(creator.link ?? creator.name)}
                      name={creator.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {recipes.length === 0 && creators.length === 0 && (
            <Box sx={{ pt: 4, color: "text.disabled", fontSize: "0.875rem" }}>No likes yet.</Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  // Generated on first request and cached, so new users work immediately.
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await getUserLikes(username);
  if (!user) return { notFound: true, revalidate: 60 };

  return {
    props: serialize({ user }),
    revalidate: 1800,
  };
}
