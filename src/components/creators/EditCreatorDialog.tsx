import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export interface EditableCreator {
  link: string;
  name: string;
  image: string;
  website: string;
  instagram: string;
  youtube: string;
  featured: boolean;
}

interface Props {
  creator: EditableCreator;
  onClose: () => void;
  onSaved: (creator: EditableCreator) => void;
}

const FIELDS: {
  key: "name" | "image" | "website" | "instagram" | "youtube";
  label: string;
  placeholder?: string;
}[] = [
  { key: "name", label: "Name" },
  { key: "image", label: "Photo URL", placeholder: "https://…/photo.jpg" },
  { key: "website", label: "Website", placeholder: "https://…" },
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/…" },
  { key: "youtube", label: "YouTube", placeholder: "https://www.youtube.com/@…" },
];

/** Admin-only editor for a creator's details. */
export default function EditCreatorDialog({ creator, onClose, onSaved }: Props) {
  const [values, setValues] = useState(creator);
  const [imageFailed, setImageFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/creators/${encodeURIComponent(creator.link)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't save.");
        return;
      }
      onSaved(data);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      fullWidth
      open
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#161616",
            backgroundImage: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
          },
        },
      }}
      onClose={saving ? undefined : onClose}
    >
      <DialogContent sx={{ p: 3.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              overflow: "hidden",
              bgcolor: "#1e1e1e",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
            }}
          >
            {values.image && !imageFailed ? (
              // A plain <img>: the preview must work for any host, before it's saved.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                src={values.image}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setImageFailed(true)}
              />
            ) : (
              values.name.charAt(0) || "?"
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.125rem" }}>
              Edit creator
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
              /creators/{creator.link}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ mb: 2.5 }}>
          {FIELDS.map(({ key, label, placeholder }) => (
            <TextField
              key={key}
              fullWidth
              error={key === "image" && imageFailed && !!values.image}
              helperText={
                key === "image" && imageFailed && values.image
                  ? "This image didn't load — check the link."
                  : undefined
              }
              label={label}
              placeholder={placeholder}
              required={key === "name"}
              size="small"
              value={values[key]}
              onChange={(e) => {
                if (key === "image") setImageFailed(false);
                setValues((prev) => ({ ...prev, [key]: e.target.value }));
              }}
            />
          ))}
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={values.featured}
              onChange={(e) => setValues((prev) => ({ ...prev, featured: e.target.checked }))}
            />
          }
          label={
            <Box>
              <Typography sx={{ fontSize: "0.875rem" }}>Featured</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
                Shown in the Featured section of the Creators page
              </Typography>
            </Box>
          }
          sx={{ mb: 2.5, alignItems: "flex-start", "& .MuiSwitch-root": { mt: -0.5 } }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button disabled={saving} size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={saving || !values.name.trim()}
            size="small"
            variant="contained"
            onClick={save}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
