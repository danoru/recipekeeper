import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Recipes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  fullWidth?: boolean;
}

const MODAL_SX = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100vw - 32px)", sm: 420 },
  bgcolor: "#161616",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
  p: 3.5,
  outline: "none",
};

export default function LogRecipeButton({ fullWidth = false }: Props) {
  const { data: session } = useSession();

  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipes | null>(null);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [hasCookedBefore, setHasCookedBefore] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<Recipes[]>([]);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const handleOpen = () => setModalOpen(true);

  const handleClose = () => {
    setModalOpen(false);
    // Reset after close animation finishes
    setTimeout(() => {
      setModalStep(1);
      setSelectedRecipe(null);
      setDate(dayjs());
      setHasCookedBefore(false);
      setComment("");
      setRating(null);
    }, 200);
  };

  const handleSave = async () => {
    if (!session?.user || !selectedRecipe) return;
    setSaving(true);
    try {
      const response = await fetch("/api/recipes/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(session.user.id),
          recipeId: selectedRecipe.id,
          name: selectedRecipe.name,
          date,
          hasCookedBefore,
          comment,
          rating,
        }),
      });

      if (response.ok) {
        setSnackbarMessage("Recipe logged successfully.");
        setSnackbarSeverity("success");
        handleClose();
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || "Failed to log recipe.");
        setSnackbarSeverity("error");
      }
    } catch {
      setSnackbarMessage("Failed to log recipe. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("/api/recipes");
      const data: Recipes[] = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name));
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  if (!session) return null;

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        fullWidth={fullWidth}
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          borderRadius: "6px",
          px: 1.75,
          py: 0.625,
          color: "primary.main",
          borderColor: "rgba(200,169,110,0.3)",
          bgcolor: "rgba(200,169,110,0.08)",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "rgba(200,169,110,0.15)",
          },
          transition: "all 0.15s",
        }}
      >
        + Log
      </Button>

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleClose}>
        <Box sx={MODAL_SX}>
          {modalStep === 1 ? (
            <StepOne
              recipes={recipes}
              selectedRecipe={selectedRecipe}
              onSelect={setSelectedRecipe}
              onNext={() => setModalStep(2)}
              onClose={handleClose}
            />
          ) : (
            <StepTwo
              selectedRecipe={selectedRecipe!}
              date={date}
              comment={comment}
              rating={rating}
              hasCookedBefore={hasCookedBefore}
              saving={saving}
              onDateChange={setDate}
              onCommentChange={setComment}
              onRatingChange={setRating}
              onHasCookedBeforeChange={setHasCookedBefore}
              onBack={() => setModalStep(1)}
              onSave={handleSave}
            />
          )}
        </Box>
      </Modal>

      {/* Toast */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ borderRadius: "8px" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

/* ─── Step 1: Pick a recipe ──────────────────────────────────────────── */
function StepOne({
  recipes,
  selectedRecipe,
  onSelect,
  onNext,
  onClose,
}: {
  recipes: Recipes[];
  selectedRecipe: Recipes | null;
  onSelect: (r: Recipes | null) => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.125rem",
            color: "text.primary",
          }}
        >
          Log a recipe
        </Typography>
        <Typography
          onClick={onClose}
          sx={{
            fontSize: "0.75rem",
            color: "text.disabled",
            cursor: "pointer",
            "&:hover": { color: "text.secondary" },
          }}
        >
          ✕
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: "0.75rem",
          color: "text.secondary",
          mb: 1,
          letterSpacing: "0.04em",
        }}
      >
        Search for a recipe
      </Typography>
      <Autocomplete
        options={recipes}
        getOptionLabel={(option) => option.name}
        value={selectedRecipe}
        onChange={(_, newValue) => onSelect(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="e.g. Chicken Pozole Verde"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "0.875rem",
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{ fontSize: "0.875rem", py: 0.75 }}
          >
            {option.name}
          </Box>
        )}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!selectedRecipe}
          sx={{ borderRadius: "8px", px: 3 }}
        >
          Next →
        </Button>
      </Box>
    </>
  );
}

/* ─── Step 2: Rate & review ──────────────────────────────────────────── */
function StepTwo({
  selectedRecipe,
  date,
  comment,
  rating,
  hasCookedBefore,
  saving,
  onDateChange,
  onCommentChange,
  onRatingChange,
  onHasCookedBeforeChange,
  onBack,
  onSave,
}: {
  selectedRecipe: Recipes;
  date: Dayjs | null;
  comment: string;
  rating: number | null;
  hasCookedBefore: boolean;
  saving: boolean;
  onDateChange: (d: Dayjs | null) => void;
  onCommentChange: (s: string) => void;
  onRatingChange: (n: number | null) => void;
  onHasCookedBeforeChange: (b: boolean) => void;
  onBack: () => void;
  onSave: () => void;
}) {
  return (
    <>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <Button
          size="small"
          onClick={onBack}
          sx={{
            minWidth: 0,
            p: 0.5,
            color: "text.disabled",
            fontSize: "0.875rem",
            "&:hover": { color: "text.secondary", bgcolor: "transparent" },
          }}
        >
          ←
        </Button>
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1rem",
            color: "text.primary",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedRecipe.name}
        </Typography>
        {hasCookedBefore && (
          <Chip
            label="Remade"
            size="small"
            sx={{
              fontSize: "0.625rem",
              height: 20,
              bgcolor: "rgba(200,169,110,0.12)",
              color: "primary.main",
              border: "1px solid rgba(200,169,110,0.25)",
            }}
          />
        )}
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {/* Recipe thumbnail */}
        <Box
          sx={{
            flexShrink: 0,
            width: 80,
            height: 80,
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            bgcolor: "#1e1e1e",
          }}
        >
          {selectedRecipe.image && (
            <Image
              src={selectedRecipe.image}
              alt={selectedRecipe.name}
              width={80}
              height={80}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          )}
        </Box>

        {/* Date + rating stacked */}
        <Stack spacing={1.25} sx={{ flex: 1 }}>
          <DatePicker
            label="Date cooked"
            value={date}
            onChange={onDateChange}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  },
                  "& .MuiInputLabel-root": { fontSize: "0.8125rem" },
                },
              },
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "0.6875rem",
                color: "text.secondary",
                mb: 0.5,
                letterSpacing: "0.06em",
              }}
            >
              Rating
            </Typography>
            <Rating
              value={rating}
              precision={0.5}
              onChange={(_, newValue) => onRatingChange(newValue)}
              sx={{
                "& .MuiRating-iconFilled": { color: "#e6b84a" },
                "& .MuiRating-iconHover": { color: "#c8a96e" },
                "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.18)" },
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Review */}
      <TextField
        label="Notes (optional)"
        multiline
        rows={3}
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        fullWidth
        size="small"
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: "0.875rem",
          },
          "& .MuiInputLabel-root": { fontSize: "0.8125rem" },
        }}
      />

      {/* Remade checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={hasCookedBefore}
            onChange={(e) => onHasCookedBeforeChange(e.target.checked)}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.2)",
              "&.Mui-checked": { color: "primary.main" },
            }}
          />
        }
        label={
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
            I&apos;ve made this before
          </Typography>
        }
        sx={{ mb: 2.5 }}
      />

      {/* Save */}
      <Button
        variant="contained"
        onClick={onSave}
        disabled={saving || !rating}
        fullWidth
        sx={{ borderRadius: "8px", py: 1 }}
      >
        {saving ? "Saving…" : "Save to diary"}
      </Button>
    </>
  );
}
