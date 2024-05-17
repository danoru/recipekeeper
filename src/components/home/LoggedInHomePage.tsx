// import FriendRecipeActivity from "./FriendRecipeActivity";
// import PopularRecipeActivity from "./PopularRecipeActivity";
import Typography from "@mui/material/Typography";

function LoggedInHomePage({ username }: any) {
  return (
    <main style={{ textAlign: "center" }}>
      <Typography variant="h6">
        Welcome back, {username}. Here&apos;s what your friends have been
        cooking...
      </Typography>
      {/* <FriendRecipeActivity />
      <PopularRecipeActivity /> */}
    </main>
  );
}

export default LoggedInHomePage;
