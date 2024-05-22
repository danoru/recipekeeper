import FriendRecipeActivity from "./FriendRecipeActivity";
import PopularRecipeActivity from "./PopularRecipeActivity";
import Typography from "@mui/material/Typography";
import { RECIPE_LIST_TYPE, USER_LIST_TYPE } from "../../types";
import Link from "@mui/material/Link";

interface Props {
  recipes: RECIPE_LIST_TYPE[];
  username: string;
  sessionUser: USER_LIST_TYPE;
}

function LoggedInHomePage({ recipes, username, sessionUser }: Props) {
  return (
    <main style={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h6">
        Welcome back, <Link href={`/${username}`}>{username}</Link>. Here&apos;s
        what your friends have been cooking...
      </Typography>
      <FriendRecipeActivity recipes={recipes} sessionUser={sessionUser} />
      <PopularRecipeActivity recipes={recipes} sessionUser={sessionUser} />
    </main>
  );
}

export default LoggedInHomePage;
