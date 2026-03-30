import Box from "@mui/material/Box";
import { DiaryEntries, Recipes } from "@prisma/client";
import Head from "next/head";

import RecipeList from "../../../src/components/recipes/RecipeList";
import ProfileLinkBar from "../../../src/components/users/ProfileLinkBar";
import { getUserDiaryEntries } from "../../../src/data/diary";
import { findUserByUsername, getAllUsers } from "../../../src/data/users";

interface Props {
  user: any;
  diaryEntries: DiaryEntries & { recipes: Recipes }[];
}

export default function UserRecipeList({ diaryEntries, user }: Props) {
  const title = `${user.username}'s Recipes • Savry`;
  const recipes: Recipes[] = diaryEntries.map((e) => e.recipes);

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
          <RecipeList header={`${user.username}'s recipes`} recipes={recipes} />
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

  const diaryEntries = await getUserDiaryEntries(user.id);

  return {
    props: { diaryEntries, user },
    revalidate: 1800,
  };
}
