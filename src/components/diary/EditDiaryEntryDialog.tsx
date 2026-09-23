import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";

import DiaryEntryFields, { type DiaryEntryValues } from "./DiaryEntryFields";

export interface EditableDiaryEntry {
  id: number;
  date: string;
  rating: number | string | null;
  comment: string | null;
  hasCookedBefore: boolean;
  recipes: { name: string; image: string } | null;
}

export interface DiaryEntryUpdate {
  id: number;
  date: string;
  rating: number | null;
  comment: string | null;
  hasCookedBefore: boolean;
}

interface Props {
  entry: EditableDiaryEntry;
  onClose: () => void;
  onSaved: (update: DiaryEntryUpdate) => void;
  onDeleted: (id: number) => void;
}

export default function EditDiaryEntryDialog({ entry, onClose, onSaved, onDeleted }: Props) {
  const [values, setValues] = useState<DiaryEntryValues>({
    date: dayjs(entry.date),
    rating: entry.rating === null ? null : Number(entry.rating),
    comment: entry.comment ?? "",
    hasCookedBefore: entry.hasCookedBefore,
  });
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(method: "PUT" | "DELETE") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/diary/${entry.id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body:
          method === "PUT"
            ? JSON.stringify({ ...values, date: values.date?.toISOString() })
            : undefined,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      if (method === "DELETE") onDeleted(entry.id);
      else onSaved(data);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
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
      onClose={busy ? undefined : onClose}
    >
      <DialogContent sx={{ p: 3.5 }}>
        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.125rem", mb: 2.5 }}>
          Edit diary entry
        </Typography>

        <DiaryEntryFields
          recipe={entry.recipes ?? { name: "Recipe", image: "" }}
          values={values}
          onChange={setValues}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {confirmDelete ? (
            <>
              <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", flex: 1 }}>
                Delete this entry?
              </Typography>
              <Button disabled={busy} size="small" onClick={() => setConfirmDelete(false)}>
                Keep it
              </Button>
              <Button
                color="error"
                disabled={busy}
                size="small"
                variant="contained"
                onClick={() => send("DELETE")}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                color="error"
                disabled={busy}
                size="small"
                sx={{ mr: "auto" }}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
              <Button disabled={busy} size="small" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={busy || !values.date?.isValid()}
                size="small"
                variant="contained"
                onClick={() => send("PUT")}
              >
                {busy ? "Saving…" : "Save"}
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
