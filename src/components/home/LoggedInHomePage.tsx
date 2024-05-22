import FriendRecipeActivity from "./FriendRecipeActivity";
import Link from "@mui/material/Link";
import PopularCreatorActivity from "./PopularCreatorActivity";
import PopularRecipeActivity from "./PopularRecipeActivity";
import Typography from "@mui/material/Typography";
import {
  CREATOR_LIST_TYPE,
  RECIPE_LIST_TYPE,
  USER_LIST_TYPE,
} from "../../types";

interface Props {
  creators: CREATOR_LIST_TYPE[];
  recipes: RECIPE_LIST_TYPE[];
  username: string;
  sessionUser: USER_LIST_TYPE;
}

function LoggedInHomePage({ creators, recipes, username, sessionUser }: Props) {
  return (
    <main style={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h6">
        Welcome back, <Link href={`/${username}`}>{username}</Link>. Here&apos;s
        what your friends have been cooking...
      </Typography>
      <FriendRecipeActivity recipes={recipes} sessionUser={sessionUser} />
      <PopularRecipeActivity recipes={recipes} sessionUser={sessionUser} />
      <PopularCreatorActivity creators={creators} sessionUser={sessionUser} />
    </main>
  );
}

export default LoggedInHomePage;
