import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";

import { getOwnSettings } from "@/data/users";
import { getSessionFromContext } from "@/lib/auth";

interface SettingsData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  website: string;
  bio: string;
}

export default function SettingsPage({ settings }: { settings: SettingsData }) {
  const username = settings.username;

  const [userData, setUserData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        <Typography sx={{ fontSize: "0.8125rem", color: "text.disabled", mb: 4 }}>
          Update your profile information.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Username (read-only) */}
          <TextField
            disabled
            fullWidth
            id="username"
            label="Username"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ ...fieldSx, mb: 2.5 }}
            value={username ?? ""}
            variant="outlined"
          />

          <Divider sx={{ mb: 2.5 }} />

          {/* Name row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              id="firstName"
              label="Given name"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
              value={userData.firstName ?? ""}
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              id="lastName"
              label="Family name"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
              value={userData.lastName ?? ""}
              variant="outlined"
              onChange={handleChange}
            />
          </Stack>

          <TextField
            fullWidth
            id="email"
            label="Email address"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ ...fieldSx, mb: 2 }}
            type="email"
            value={userData.email ?? ""}
            variant="outlined"
            onChange={handleChange}
          />

          {/* Location / website row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              id="location"
              label="Location"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
              value={userData.location ?? ""}
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              id="website"
              label="Website"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
              value={userData.website ?? ""}
              variant="outlined"
              onChange={handleChange}
            />
          </Stack>

          <TextField
            fullWidth
            multiline
            id="bio"
            label="Bio"
            rows={4}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ ...fieldSx, mb: 3 }}
            value={userData.bio ?? ""}
            variant="outlined"
            onChange={handleChange}
          />

          <Button
            disabled={saving}
            sx={{ borderRadius: "8px", px: 3 }}
            type="submit"
            variant="contained"
          >
            {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
          </Button>
        </Box>
      </Box>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionFromContext(context);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const user = await getOwnSettings(Number(session.user.id));
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const settings: SettingsData = {
    username: user.username,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    location: user.location ?? "",
    website: user.website ?? "",
    bio: user.bio ?? "",
  };
  return { props: { settings } };
}
