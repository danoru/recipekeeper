import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SettingsPage({ session }: any) {
  const username = session?.user?.username;
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: username ?? "",
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    website: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/user/${username}`)
      .then((r) => r.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      });
  }, [username]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch(`/api/user/${username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" },
    "& .MuiInputLabel-root": { fontSize: "0.8125rem" },
  };

  return (
    <>
      <Head>
        <title>Settings • Savry</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "560px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: 5,
          pb: 12,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: "text.primary",
            mb: 0.75,
          }}
        >
          Account settings
        </Typography>
        <Typography
          sx={{ fontSize: "0.8125rem", color: "text.disabled", mb: 4 }}
        >
          Update your profile information.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Username (read-only) */}
          <TextField
            id="username"
            label="Username"
            disabled
            fullWidth
            value={username ?? ""}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldSx, mb: 2.5 }}
          />

          <Divider sx={{ mb: 2.5 }} />

          {/* Name row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mb: 2 }}
          >
            <TextField
              id="firstName"
              label="Given name"
              variant="outlined"
              fullWidth
              value={userData.firstName ?? ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <TextField
              id="lastName"
              label="Family name"
              variant="outlined"
              fullWidth
              value={userData.lastName ?? ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Stack>

          <TextField
            id="email"
            label="Email address"
            type="email"
            variant="outlined"
            fullWidth
            value={userData.email ?? ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldSx, mb: 2 }}
          />

          {/* Location / website row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mb: 2 }}
          >
            <TextField
              id="location"
              label="Location"
              variant="outlined"
              fullWidth
              value={userData.location ?? ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <TextField
              id="website"
              label="Website"
              variant="outlined"
              fullWidth
              value={userData.website ?? ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Stack>

          <TextField
            id="bio"
            label="Bio"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={userData.bio ?? ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldSx, mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={saving || loading}
            sx={{ borderRadius: "8px", px: 3 }}
          >
            {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
          </Button>
        </Box>
      </Box>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: { session } };
}
