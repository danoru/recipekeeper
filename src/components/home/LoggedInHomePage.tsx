import Typography from "@mui/material/Typography";

function LoggedInHomePage({ username }: any) {
  return (
    <main style={{ textAlign: "center" }}>
      <Typography variant="h6">
        Welcome back, {username}. Here's what your friends have been cooking...
      </Typography>
    </main>
  );
}

export default LoggedInHomePage;
