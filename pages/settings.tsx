import Button from "@mui/material/Button";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

function SettingsPage({ session }: any) {
  const username = session?.user?.username;

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    location: "",
    website: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (username) {
      fetch(`/api/user/${username}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          setLoading(false);
        });
    }
  }, [username]);

  return (
    <div>
      <Head>
        <title>Account Settings • Savry</title>
      </Head>
      <Stack direction="row" sx={{ justifyContent: "center" }}>
        <div>
          <TextField
            id="username"
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
              id="firstName"
              label="Given Name"
              variant="outlined"
              value={userData.firstname}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="lastName"
              label="Family Name"
              value={userData.lastname}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
          </Stack>
          <TextField
            id="email"
            label="Email Address"
            value={userData.email}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: "10px" }}
          />
          <Stack direction="row">
            <TextField
              id="location"
              label="Location"
              value={userData.location}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="website"
              label="Website"
              value={userData.website}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
          </Stack>
          <TextField
            id="bio"
            label="Bio"
            fullWidth
            multiline
            rows={4}
            value={userData.bio}
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
