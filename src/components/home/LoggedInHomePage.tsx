import FriendRecipeActivity from "./FriendRecipeActivity";
import Link from "@mui/material/Link";
import PopularCreatorActivity from "./PopularCreatorActivity";
import PopularRecipeActivity from "./PopularRecipeActivity";
import Typography from "@mui/material/Typography";
import { Creators, Recipes, Users, DiaryEntries } from "@prisma/client";

interface Props {
  creators: Creators[];
  recentEntries: (DiaryEntries & { users: Users })[];
  recipes: Recipes[];
  username: string;
  sessionUser: Users;
}

function LoggedInHomePage({
  creators,
  recentEntries,
  recipes,
  username,
  sessionUser,
}: Props) {
  return (
    <main style={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h6">
        Welcome back, <Link href={`/${username}`}>{username}</Link>. Here&apos;s
        what your friends have been cooking...
      </Typography>
      <FriendRecipeActivity
        recentEntries={recentEntries}
        recipes={recipes}
        sessionUser={sessionUser}
      />
      <PopularRecipeActivity recipes={recipes} sessionUser={sessionUser} />
      <PopularCreatorActivity creators={creators} sessionUser={sessionUser} />
    </main>
  );
}

export default LoggedInHomePage;
