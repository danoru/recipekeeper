import FriendRecipeActivity from "./FriendRecipeActivity";
// import PopularRecipeActivity from "./PopularRecipeActivity";
import Typography from "@mui/material/Typography";
import { RECIPE_LIST_TYPE, UserDiary } from "../../types";
import Link from "@mui/material/Link";

interface Props {
  recentEntries: UserDiary[];
  recipes: RECIPE_LIST_TYPE[];
  username: string;
}

function LoggedInHomePage({ recentEntries, recipes, username }: Props) {
  return (
    <main style={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h6">
        Welcome back, <Link href={`/${username}`}>{username}</Link>. Here&apos;s
        what your friends have been cooking...
      </Typography>
      <FriendRecipeActivity recentEntries={recentEntries} recipes={recipes} />
      {/* <PopularRecipeActivity /> */}
    </main>
  );
}

export default LoggedInHomePage;
