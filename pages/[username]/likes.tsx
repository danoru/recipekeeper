import Box from "@mui/material/Box";
import Head from "next/head";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import RecipeList from "../../src/components/recipes/RecipeList";
import SectionHeader from "../../src/components/ui/SectionHeader";
import Grid from "@mui/material/Grid";
import CreatorCard from "../../src/components/cards/CreatorCard";
import { getAllUsers, getUserLikes } from "../../src/data/users";
import { creatorHref, serializePrisma } from "../../src/data/helpers";

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
            <RecipeList
              header={`${user.username}'s liked recipes`}
              recipes={recipes}
            />
          )}

          {creators.length > 0 && (
            <Box>
              <SectionHeader label={`${user.username}'s liked creators`} />
              <Grid container spacing={1.5}>
                {creators.map((creator: any, i: number) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <CreatorCard
                      name={creator.name}
                      image={creator.image}
                      link={creatorHref(creator.link ?? creator.name)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {recipes.length === 0 && creators.length === 0 && (
            <Box sx={{ pt: 4, color: "text.disabled", fontSize: "0.875rem" }}>
              No likes yet.
            </Box>
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

export async function getStaticProps({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const user = await getUserLikes(username);
  if (!user) return { notFound: true };

  return {
    props: serializePrisma({ user }),
    revalidate: 1800,
  };
}
