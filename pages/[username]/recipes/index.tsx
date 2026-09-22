import Box from "@mui/material/Box";
import Head from "next/head";

import RecipeList from "@/components/recipes/RecipeList";
import ProfileLinkBar from "@/components/users/ProfileLinkBar";
import { getUserDiaryEntries } from "@/data/diary";
import { serialize } from "@/data/serialize";
import { findUserByUsername } from "@/data/users";
import type { DiaryEntries, Recipes } from "@/generated/prisma/browser";

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
  // Generated on first request and cached, so new users work immediately.
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { username: string } }) {
  const { username } = params;
  const user = await findUserByUsername(username);
  if (!user) return { notFound: true, revalidate: 60 };

  const diaryEntries = await getUserDiaryEntries(user.id);

  return {
    props: serialize({ diaryEntries, user }),
    revalidate: 1800,
  };
}
