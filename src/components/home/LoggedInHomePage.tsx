import { memo } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Creators, Recipes, Users, DiaryEntries } from "@prisma/client";

import FriendRecipeActivity from "./FriendRecipeActivity";
import PopularCreatorActivity from "./PopularCreatorActivity";
import PopularRecipeActivity from "./PopularRecipeActivity";

interface Props {
  creators: Creators[];
  recentEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
  recipes: Recipes[];
  username: string;
}

function LoggedInHomePage({
  creators,
  recentEntries,
  recipes,
  username,
}: Props) {
  return (
    <main style={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h6">
        Welcome back, <Link href={`/${username}`}>{username}</Link>. Here&apos;s
        what your friends have been cooking...
      </Typography>
      <FriendRecipeActivity recentEntries={recentEntries} />
      <PopularRecipeActivity recipes={recipes} />
      <PopularCreatorActivity creators={creators} />
    </main>
  );
}

export default memo(LoggedInHomePage);
