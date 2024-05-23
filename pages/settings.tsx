import Button from "@mui/material/Button";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { getSession } from "next-auth/react";

function SettingsPage({ session }: any) {
  const username = session?.user?.username;
  return (
    <div>
      <Head>
        <title>Account Settings • Savry</title>
      </Head>
      <Stack direction="row" sx={{ justifyContent: "center" }}>
        <div>
          <TextField
            id="outlined-basic"
            label="Username"
            disabled
            fullWidth
            value={username}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ margin: "10px 0" }}
          />
          <Stack direction="row">
            <TextField
              id="outlined-basic"
              label="Given Name"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="outlined-basic"
              label="Family Name"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
          </Stack>
          <TextField
            id="outlined-basic"
            label="Email Address"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: "10px" }}
          />
          <Stack direction="row">
            <TextField
              id="outlined-basic"
              label="Location"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="outlined-basic"
              label="Website"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
          </Stack>
          <TextField
            id="outlined-basic"
            label="Bio"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: "10px" }}
          />
          <Button variant="contained" disabled>
            Save Changes
          </Button>
        </div>
        {/* <div>
          <Typography variant="h6">Favorite Recipes</Typography>
          <Typography variant="h6">Favorite Creators</Typography>
        </div> */}
      </Stack>
    </div>
  );
}

export default SettingsPage;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
