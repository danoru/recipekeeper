import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
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
  MenuItem,
} from "@mui/material";
import NextLink from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";

import { blankRecipe, type ImportedRecipe, type PageData } from "@/lib/import/jsonld";
import {
  CATEGORY_OPTIONS,
  COURSE_OPTIONS,
  CUISINE_OPTIONS,
  DIET_OPTIONS,
  METHOD_OPTIONS,
} from "@/lib/import/taxonomy";

// ─── Types ────────────────────────────────────────────────────────────────────

type ParsedRecipe = ImportedRecipe;

interface ImportPreview {
  recipe: ParsedRecipe;
  creatorExists: boolean;
  existingCreator: { name: string; link: string; image: string } | null;
  existingRecipe: { name: string; href: string } | null;
}

type Step = "input" | "preview" | "success";

interface ImportRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (recipeId: number) => void;
  /** Start by fetching this URL (e.g. from the share target). */
  initialUrl?: string;
  /** Start from page data captured by the bookmarklet. */
  initialPage?: PageData;
}

// ─── Field configs ────────────────────────────────────────────────────────────

const RECIPE_TEXT_FIELDS: {
  key: keyof ParsedRecipe;
  label: string;
  multiline?: boolean;
}[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description", multiline: true },
  { key: "image", label: "Image URL" },
];

const RECIPE_SELECT_FIELDS: {
  key: keyof ParsedRecipe;
  label: string;
  options: string[];
}[] = [
  { key: "category", label: "Category", options: CATEGORY_OPTIONS },
  { key: "cuisine", label: "Cuisine", options: CUISINE_OPTIONS },
  { key: "course", label: "Course", options: COURSE_OPTIONS },
  { key: "method", label: "Method", options: METHOD_OPTIONS },
  { key: "diet", label: "Diet", options: DIET_OPTIONS },
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

function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h && `${h} hr`, m && `${m} min`].filter(Boolean).join(" ");
}

// ─── Small section label ──────────────────────────────────────────────────────

function SectionLabel({ letter, label, color }: { letter: string; label: string; color: string }) {
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
        <Typography sx={{ fontSize: "0.625rem", fontWeight: 700, color, letterSpacing: 0 }}>
          {letter}
        </Typography>
      </Box>
      <Typography
        sx={{ color: "text.secondary", letterSpacing: "0.12em", fontSize: "0.65rem" }}
        variant="overline"
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
  initialUrl,
  initialPage,
}: ImportRecipeModalProps) {
  const [step, setStep] = useState<Step>("input");
  const [url, setUrl] = useState(initialUrl ?? initialPage?.url ?? "");
  // Opened with a URL or bookmarklet data, the preview starts loading immediately.
  const [loading, setLoading] = useState(Boolean(initialUrl || initialPage));
  const [error, setError] = useState<string | null>(null);
  const [errorHref, setErrorHref] = useState<string | null>(null);
  // Set when the page couldn't be read, so the user can fill in the recipe themselves.
  const [canEnterManually, setCanEnterManually] = useState(false);
  const [manual, setManual] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
  const [savedHref, setSavedHref] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = useCallback(() => {
    setStep("input");
    setUrl("");
    setError(null);
    setErrorHref(null);
    setCanEnterManually(false);
    setManual(false);
    setPreview(null);
    setRecipe(null);
    setSavedHref(null);
    setLoading(false);
    setSaving(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  // Shared by the URL fetch (GET) and bookmarklet page data (POST). State is
  // only set after the request settles, so this is safe to start from an effect.
  const loadPreview = useCallback(async (request: Promise<Response>) => {
    try {
      const res = await request;
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong fetching that URL.");
        setCanEnterManually(Boolean(data.manual));
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
  }, []);

  const handleFetch = () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setErrorHref(null);
    setCanEnterManually(false);
    loadPreview(fetch(`/api/recipes/import?url=${encodeURIComponent(url.trim())}`));
  };

  const enterManually = () => {
    const blank = blankRecipe(url.trim());
    setPreview({
      recipe: blank,
      creatorExists: false,
      existingCreator: null,
      existingRecipe: null,
    });
    setRecipe(blank);
    setManual(true);
    setError(null);
    setStep("preview");
  };

  // Kick off automatically when opened from the share target or bookmarklet.
  const started = useRef(false);
  useEffect(() => {
    if (!isOpen || started.current || !(initialPage || initialUrl)) return;
    started.current = true;
    loadPreview(
      initialPage
        ? fetch("/api/recipes/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: initialPage }),
          })
        : fetch(`/api/recipes/import?url=${encodeURIComponent(initialUrl!.trim())}`)
    );
  }, [isOpen, initialPage, initialUrl, loadPreview]);

  const handleSave = async () => {
    if (!recipe) return;
    setSaving(true);
    setError(null);
    setErrorHref(null);
    try {
      const res = await fetch("/api/recipes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save recipe.");
        setErrorHref(data.href ?? null);
        return;
      }
      setSavedHref(data.recipe.href ?? null);
      setStep("success");
      onSuccess?.(data.recipe.id);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const found = recipe
    ? [
        recipe.ingredients.length && `${recipe.ingredients.length} ingredients`,
        recipe.steps.length && `${recipe.steps.length} steps`,
        recipe.totalTimeMinutes && formatMinutes(recipe.totalTimeMinutes),
        recipe.recipeYield && `serves ${recipe.recipeYield.replace(/\s*servings?$/i, "")}`,
      ].filter(Boolean)
    : [];

  const updateField = (key: keyof ParsedRecipe, value: string) =>
    setRecipe((prev) => (prev ? { ...prev, [key]: value } : prev));

  const titleText = {
    input: "Import Recipe",
    preview: "Review & Edit",
    success: "Recipe Imported",
  }[step];
  const subtitleText = {
    input: "Paste a URL — we'll extract the recipe automatically",
    preview: "Check the details before saving",
    success: "Successfully added to your collection",
  }[step];

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
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
      onClose={handleClose}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.25 }}>
            <FileDownloadOutlinedIcon sx={{ fontSize: 18, color: "primary.main", mt: "1px" }} />
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                color: "text.primary",
                fontWeight: 500,
              }}
              variant="h6"
            >
              {titleText}
            </Typography>
          </Box>
          <Typography color="text.secondary" sx={{ pl: 0.5 }} variant="body2">
            {subtitleText}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: "text.disabled", mt: 0.5 }} onClick={handleClose}>
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
                autoFocus
                fullWidth
                label="Recipe URL"
                placeholder="https://budgetbytes.com/some-great-recipe"
                size="small"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              />
              <Collapse in={!!error}>
                <Alert
                  action={
                    canEnterManually ? (
                      <Button color="inherit" size="small" onClick={enterManually}>
                        Enter it manually
                      </Button>
                    ) : undefined
                  }
                  icon={<ErrorOutlineIcon fontSize="small" />}
                  severity="error"
                  sx={{ borderRadius: 1.5 }}
                >
                  {error}
                </Alert>
              </Collapse>
              <Typography
                color="text.disabled"
                sx={{ textAlign: "center", display: "block" }}
                variant="caption"
              >
                Works with AllRecipes, Budget Bytes, Serious Eats, NYT Cooking, and most major
                recipe sites.
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Step: Preview */}
        {step === "preview" && recipe && preview && (
          <Fade in>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {preview.existingRecipe && (
                <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                  This recipe is already on Savry.{" "}
                  <NextLink href={preview.existingRecipe.href} onClick={handleClose}>
                    View {preview.existingRecipe.name}
                  </NextLink>
                </Alert>
              )}

              {/* What the page gave us */}
              {!manual && (
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {found.length > 0 ? (
                    found.map((label) => (
                      <Chip
                        key={String(label)}
                        label={label}
                        size="small"
                        sx={{ fontSize: "0.7rem", bgcolor: "rgba(200,169,110,0.1)" }}
                      />
                    ))
                  ) : (
                    <Typography color="text.disabled" variant="caption">
                      No ingredient list found on this page — you can add one below.
                    </Typography>
                  )}
                </Box>
              )}

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
                    alt={recipe.name}
                    component="img"
                    src={recipe.image}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </Box>
              )}

              {/* Recipe fields */}
              <Box>
                <SectionLabel color="#c8a96e" label="Recipe Details" letter="R" />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {/* Text fields */}
                  {RECIPE_TEXT_FIELDS.map(({ key, label, multiline }) => (
                    <TextField
                      key={key}
                      fullWidth
                      label={label}
                      multiline={multiline}
                      rows={multiline ? 3 : undefined}
                      size="small"
                      value={recipe[key] as string}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  ))}

                  <TextField
                    fullWidth
                    multiline
                    helperText="One per line, e.g. “2 cups flour”. Lines ending in “:” become sections."
                    label="Ingredients"
                    minRows={4}
                    size="small"
                    value={recipe.ingredients.join("\n")}
                    onChange={(e) =>
                      setRecipe((prev) =>
                        prev ? { ...prev, ingredients: e.target.value.split("\n") } : prev
                      )
                    }
                  />

                  {/* Select fields — rendered in a 2-column grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1.5,
                    }}
                  >
                    {RECIPE_SELECT_FIELDS.map(({ key, label, options }) => (
                      <TextField
                        key={key}
                        fullWidth
                        select
                        label={label}
                        size="small"
                        value={recipe[key] as string}
                        onChange={(e) => updateField(key, e.target.value)}
                      >
                        <MenuItem value="">
                          <Typography color="text.disabled" variant="body2">
                            — None —
                          </Typography>
                        </MenuItem>
                        {options.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    ))}
                  </Box>
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
                  <SectionLabel color="#888580" label="Creator" letter="C" />
                  {preview.creatorExists && (
                    <Chip
                      label="Already on Savry — won't be overwritten"
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
                    color="text.disabled"
                    sx={{ display: "block", mb: 1.5, mt: -1 }}
                    variant="caption"
                  >
                    This creator isn&apos;t on Savry yet — they&apos;ll be added on save.
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
                      fullWidth
                      helperText={helperText}
                      label={label}
                      size="small"
                      value={recipe[key] as string}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  ))}
                </Box>
              </Box>

              <Collapse in={!!error}>
                <Alert
                  icon={<ErrorOutlineIcon fontSize="small" />}
                  severity="error"
                  sx={{ borderRadius: 1.5 }}
                >
                  {error}{" "}
                  {errorHref && (
                    <NextLink href={errorHref} onClick={handleClose}>
                      View it
                    </NextLink>
                  )}
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
                <CheckCircleOutlineIcon sx={{ fontSize: 28, color: "primary.main" }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 500,
                    fontSize: "1rem",
                  }}
                  variant="h6"
                >
                  {recipe?.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
                  Added to Savry.
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
            <Button size="small" variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={!url.trim() || loading}
              size="small"
              startIcon={loading ? <CircularProgress color="inherit" size={13} /> : undefined}
              sx={{ minWidth: 130 }}
              variant="contained"
              onClick={handleFetch}
            >
              {loading ? "Fetching…" : "Fetch Recipe"}
            </Button>
          </>
        )}

        {step === "preview" && (
          <>
            <Button
              size="small"
              startIcon={<ArrowBackIcon fontSize="small" />}
              variant="outlined"
              onClick={() => {
                setStep("input");
                setError(null);
              }}
            >
              Back
            </Button>
            <Button
              disabled={saving || !!preview?.existingRecipe || !recipe?.name.trim()}
              size="small"
              startIcon={saving ? <CircularProgress color="inherit" size={13} /> : undefined}
              sx={{ minWidth: 160 }}
              variant="contained"
              onClick={handleSave}
            >
              {saving ? "Saving…" : "Save to Savry"}
            </Button>
          </>
        )}

        {step === "success" && (
          <>
            <Button size="small" variant="outlined" onClick={reset}>
              Import Another
            </Button>
            {savedHref ? (
              <Button
                component={NextLink}
                href={savedHref}
                size="small"
                variant="contained"
                onClick={handleClose}
              >
                View recipe
              </Button>
            ) : (
              <Button size="small" variant="contained" onClick={handleClose}>
                Done
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
