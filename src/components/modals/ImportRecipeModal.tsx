"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Collapse,
  Fade,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedRecipe {
  name: string;
  description: string;
  image: string;
  category: string;
  cuisine: string;
  course: string;
  method: string;
  diet: string;
  link: string;
  creatorName: string;
  creatorLink: string;
  creatorWebsite: string;
  creatorImage: string;
  creatorInstagram: string;
  creatorYoutube: string;
}

interface ImportPreview {
  recipe: ParsedRecipe;
  creatorExists: boolean;
  existingCreator: { name: string; link: string; image: string } | null;
}

type Step = "input" | "preview" | "success";

interface ImportRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (recipeId: number) => void;
}

// ─── Field config ─────────────────────────────────────────────────────────────

const RECIPE_FIELDS: {
  key: keyof ParsedRecipe;
  label: string;
  multiline?: boolean;
}[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description", multiline: true },
  { key: "image", label: "Image URL" },
  { key: "category", label: "Category" },
  { key: "cuisine", label: "Cuisine" },
  { key: "course", label: "Course" },
  { key: "method", label: "Method" },
  { key: "diet", label: "Diet" },
];

const CREATOR_FIELDS: {
  key: keyof ParsedRecipe;
  label: string;
  helperText?: string;
}[] = [
  { key: "creatorName", label: "Name" },
  {
    key: "creatorLink",
    label: "Slug / URL Key",
    helperText: "Used as the unique creator ID",
  },
  { key: "creatorWebsite", label: "Website" },
  { key: "creatorImage", label: "Image URL" },
  { key: "creatorInstagram", label: "Instagram" },
  { key: "creatorYoutube", label: "YouTube" },
];

// ─── Small section label ──────────────────────────────────────────────────────

function SectionLabel({
  letter,
  label,
  color,
}: {
  letter: string;
  label: string;
  color: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: `${color}18`,
          border: `1px solid ${color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.625rem",
            fontWeight: 700,
            color,
            letterSpacing: 0,
          }}
        >
          {letter}
        </Typography>
      </Box>
      <Typography
        variant="overline"
        sx={{
          color: "text.secondary",
          letterSpacing: "0.12em",
          fontSize: "0.65rem",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImportRecipeModal({
  isOpen,
  onClose,
  onSuccess,
}: ImportRecipeModalProps) {
  const [step, setStep] = useState<Step>("input");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = useCallback(() => {
    setStep("input");
    setUrl("");
    setError(null);
    setPreview(null);
    setRecipe(null);
    setLoading(false);
    setSaving(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/import-recipe?url=${encodeURIComponent(url.trim())}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong fetching that URL.");
        return;
      }
      setPreview(data);
      setRecipe(data.recipe);
      setStep("preview");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/import-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save recipe.");
        return;
      }
      setStep("success");
      onSuccess?.(data.recipe.id);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof ParsedRecipe, value: string) =>
    setRecipe((prev) => (prev ? { ...prev, [key]: value } : prev));

  const titleText = {
    input: "Import Recipe",
    preview: "Review & Edit",
    success: "Recipe Imported",
  }[step];
  const subtitleText = {
    input: "Paste a URL — we'll extract the recipe automatically",
    preview: "Check the details before saving to your database",
    success: "Successfully added to your collection",
  }[step];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          },
        },
        backdrop: { sx: { backdropFilter: "blur(4px)" } },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          pb: 0.5,
          pt: 2.5,
          px: 3,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.25 }}
          >
            <FileDownloadOutlinedIcon
              sx={{ fontSize: 18, color: "primary.main", mt: "1px" }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                color: "text.primary",
                fontWeight: 500,
              }}
            >
              {titleText}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 0.5 }}>
            {subtitleText}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "text.disabled", mt: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* ── Body ── */}
      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
        {/* Step: Input */}
        {step === "input" && (
          <Fade in>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Recipe URL"
                placeholder="https://budgetbytes.com/some-great-recipe"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                fullWidth
                autoFocus
                type="url"
                size="small"
              />
              <Collapse in={!!error}>
                <Alert
                  severity="error"
                  icon={<ErrorOutlineIcon fontSize="small" />}
                  sx={{ borderRadius: 1.5 }}
                >
                  {error}
                </Alert>
              </Collapse>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ textAlign: "center", display: "block" }}
              >
                Works with AllRecipes, Budget Bytes, Serious Eats, NYT Cooking,
                and most major recipe sites.
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Step: Preview */}
        {step === "preview" && recipe && preview && (
          <Fade in>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Image */}
              {recipe.image && (
                <Box
                  sx={{
                    width: "100%",
                    height: 180,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={recipe.image}
                    alt={recipe.name}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = "none";
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              )}

              {/* Recipe fields */}
              <Box>
                <SectionLabel
                  letter="R"
                  label="Recipe Details"
                  color="#c8a96e"
                />
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {RECIPE_FIELDS.map(({ key, label, multiline }) => (
                    <TextField
                      key={key}
                      label={label}
                      value={recipe[key] as string}
                      onChange={(e) => updateField(key, e.target.value)}
                      fullWidth
                      size="small"
                      multiline={multiline}
                      rows={multiline ? 3 : undefined}
                    />
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Creator fields */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <SectionLabel letter="C" label="Creator" color="#888580" />
                  {preview.creatorExists && (
                    <Chip
                      label="Already in your DB — won't be overwritten"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.6rem",
                        letterSpacing: "0.05em",
                        bgcolor: "rgba(136,133,128,0.1)",
                        color: "text.secondary",
                        border: "1px solid",
                        borderColor: "divider",
                        mb: 2,
                      }}
                    />
                  )}
                </Box>

                {!preview.creatorExists && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: "block", mb: 1.5, mt: -1 }}
                  >
                    This creator isn't in your database yet — they'll be created
                    on save.
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    opacity: preview.creatorExists ? 0.4 : 1,
                    pointerEvents: preview.creatorExists ? "none" : "auto",
                    transition: "opacity 0.2s",
                  }}
                >
                  {CREATOR_FIELDS.map(({ key, label, helperText }) => (
                    <TextField
                      key={key}
                      label={label}
                      value={recipe[key] as string}
                      onChange={(e) => updateField(key, e.target.value)}
                      fullWidth
                      size="small"
                      helperText={helperText}
                    />
                  ))}
                </Box>
              </Box>

              <Collapse in={!!error}>
                <Alert
                  severity="error"
                  icon={<ErrorOutlineIcon fontSize="small" />}
                  sx={{ borderRadius: 1.5 }}
                >
                  {error}
                </Alert>
              </Collapse>
            </Box>
          </Fade>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <Fade in>
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "rgba(200,169,110,0.08)",
                  border: "1px solid rgba(200,169,110,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 28, color: "primary.main" }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 500,
                    fontSize: "1rem",
                  }}
                >
                  {recipe?.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Added to your recipe database.
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </DialogContent>

      <Divider />

      {/* ── Actions ── */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {step === "input" && (
          <>
            <Button variant="outlined" onClick={handleClose} size="small">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleFetch}
              disabled={!url.trim() || loading}
              size="small"
              startIcon={
                loading ? (
                  <CircularProgress size={13} color="inherit" />
                ) : undefined
              }
              sx={{ minWidth: 130 }}
            >
              {loading ? "Fetching…" : "Fetch Recipe"}
            </Button>
          </>
        )}

        {step === "preview" && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setStep("input");
                setError(null);
              }}
              size="small"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              size="small"
              startIcon={
                saving ? (
                  <CircularProgress size={13} color="inherit" />
                ) : undefined
              }
              sx={{ minWidth: 160 }}
            >
              {saving ? "Saving…" : "Save to Database"}
            </Button>
          </>
        )}

        {step === "success" && (
          <>
            <Button variant="outlined" onClick={reset} size="small">
              Import Another
            </Button>
            <Button variant="contained" onClick={handleClose} size="small">
              Done
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
