import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import superjson from "superjson";

import RecipeList from "../../src/components/recipes/RecipeList";
import ProfileLinkBar from "../../src/components/users/ProfileLinkBar";
import { getCooklist } from "../../src/data/recipes";
import { findUserByUsername, getAllUsers } from "../../src/data/users";

interface Props {
  user: any;
  cooklist: any[];
}

export default function UserCooklist({ cooklist, user }: Props) {
  const title = `${user.username}'s Cooklist • Savry`;
  const recipes = cooklist.map((item: any) => item.recipes);

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

        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontSize: "0.8125rem", color: "text.disabled", mb: 3 }}>
            {cooklist.length} {cooklist.length === 1 ? "recipe" : "recipes"} saved
          </Typography>
          <RecipeList header={`${user.username}'s cooklist`} recipes={recipes} />
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

  const cooklist = await getCooklist(user.id);

  return {
    props: superjson.serialize({ cooklist, user }).json,
    revalidate: 1800,
  };
}
