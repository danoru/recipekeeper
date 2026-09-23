import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import Image from "next/image";

export interface DiaryEntryValues {
  date: Dayjs | null;
  rating: number | null;
  comment: string;
  hasCookedBefore: boolean;
}

interface Props {
  recipe: { name: string; image: string };
  values: DiaryEntryValues;
  onChange: (values: DiaryEntryValues) => void;
}

/** Date, rating, notes, and "made before" — shared by logging and editing a diary entry. */
export default function DiaryEntryFields({ recipe, values, onChange }: Props) {
  const set = <K extends keyof DiaryEntryValues>(key: K, value: DiaryEntryValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <>
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
          {recipe.image && (
            <Image
              alt={recipe.name}
              height={80}
              src={recipe.image}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              width={80}
            />
          )}
        </Box>

        {/* Date + rating stacked */}
        <Stack spacing={1.25} sx={{ flex: 1 }}>
          <DatePicker
            disableFuture
            label="Date cooked"
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" },
                  "& .MuiInputLabel-root": { fontSize: "0.8125rem" },
                },
              },
            }}
            value={values.date}
            onChange={(date) => set("date", date)}
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
              Rating{" "}
              <Box component="span" sx={{ color: "text.disabled" }}>
                (optional — tap the same star again to clear)
              </Box>
            </Typography>
            <Rating
              precision={0.5}
              sx={{
                "& .MuiRating-iconFilled": { color: "#e6b84a" },
                "& .MuiRating-iconHover": { color: "#c8a96e" },
                "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.18)" },
              }}
              value={values.rating}
              onChange={(_, rating) => set("rating", rating)}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Review */}
      <TextField
        fullWidth
        multiline
        label="Notes (optional)"
        rows={3}
        size="small"
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" },
          "& .MuiInputLabel-root": { fontSize: "0.8125rem" },
        }}
        value={values.comment}
        onChange={(e) => set("comment", e.target.value)}
      />

      {/* Remade checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={values.hasCookedBefore}
            size="small"
            sx={{ color: "rgba(255,255,255,0.2)", "&.Mui-checked": { color: "primary.main" } }}
            onChange={(e) => set("hasCookedBefore", e.target.checked)}
          />
        }
        label={
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
            I&apos;ve made this before
          </Typography>
        }
        sx={{ mb: 2.5 }}
      />
    </>
  );
}
