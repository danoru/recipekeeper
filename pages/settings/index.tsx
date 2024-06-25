import Button from "@mui/material/Button";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function SettingsPage({ session }: any) {
  const username = session?.user?.username;
  const router = useRouter();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
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

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const response = await fetch(`/api/user/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      router.reload();
    } else {
      console.error("Failed to update user data.");
    }

    setSaving(false);
  }

  return (
    <div>
      <Head>
        <title>Account Settings • Savry</title>
      </Head>
      <Stack direction="row" sx={{ justifyContent: "center" }}>
        <form onSubmit={handleSubmit}>
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
              value={userData.firstName}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="lastName"
              label="Family Name"
              value={userData.lastName}
              variant="outlined"
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
          </Stack>
          <TextField
            id="email"
            label="Email Address"
            value={userData.email}
            variant="outlined"
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: "10px" }}
          />
          <Stack direction="row">
            <TextField
              id="location"
              label="Location"
              value={userData.location}
              variant="outlined"
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              id="website"
              label="Website"
              value={userData.website}
              variant="outlined"
              onChange={handleChange}
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
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: "10px" }}
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {/* <div>
          <Typography variant="h6">Favorite Recipes</Typography>
          <Typography variant="h6">Favorite Creators</Typography>
        </div> */}
        </form>
      </Stack>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default SettingsPage;
