import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import moment, { Moment } from "moment";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Recipes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function LogRecipeButton() {
  const [modalStep, setModalStep] = useState(1);
  const [modalOpen, modalSetOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipes | null>(null);
  const [date, setDate] = useState<Moment | null>(moment());
  const [hasCookedBefore, setHasCookedBefore] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<Recipes[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { data: session } = useSession();

  const handleModalOpen = () => modalSetOpen(true);
  const handleModalClose = () => {
    modalSetOpen(false);
    setModalStep(1);
  };

  const handleNextStep = () => setModalStep(2);
  const handlePreviousStep = () => setModalStep(1);

  const handleSave = async () => {
    if (session && session.user) {
      try {
        const response = await fetch("/api/recipes/log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(session.user.id),
            recipeId: selectedRecipe?.id,
            name: selectedRecipe?.name,
            date,
            hasCookedBefore,
            comment,
            rating,
          }),
        });
        if (response.ok) {
          handleModalClose();
          setSnackbarMessage("Recipe successfully added.");
          setSnackbarSeverity("success");
          setSelectedRecipe(null);
          setDate(moment());
          setHasCookedBefore(false);
          setComment("");
          setRating(null);
        } else {
          const errorData = await response.json();
          setSnackbarMessage(errorData.error || "Failed to log recipe.");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        setSnackbarMessage("Failed to log recipe. Please try again.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("/api/recipes");
      const data = await response.json();
      data.sort((a: any, b: any) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  return (
    <Box>
      <Button variant="contained" size="small" onClick={handleModalOpen}>
        + LOG
      </Button>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            borderRadius: "5px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {modalStep === 1 ? (
            <>
              <Typography variant="h6">ADD TO YOUR RECIPES...</Typography>
              <Typography variant="caption" sx={{ marginTop: 2 }}>
                Name of Recipe
              </Typography>
              <Autocomplete
                options={recipes}
                getOptionLabel={(option) => option.name}
                value={selectedRecipe}
                onChange={(event, newValue) => setSelectedRecipe(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                onClick={handleNextStep}
                disabled={!selectedRecipe}
                sx={{ marginTop: "10px" }}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" onClick={handlePreviousStep}>
                Back
              </Button>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                I cooked {selectedRecipe?.name}
              </Typography>
              <Stack direction="column">
                <Image
                  src={selectedRecipe?.image || "No Recipe Found"}
                  alt={selectedRecipe?.name || "No Recipe Found"}
                  width={200}
                  height={200}
                  style={{
                    alignItems: "center",
                    borderRadius: "5%",
                    marginBottom: "10px",
                  }}
                />
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue: Moment | null) => setDate(newValue)}
                />
                <TextField
                  label="Comment"
                  multiline
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Rating
                  value={rating}
                  precision={0.5}
                  onChange={(event, newValue) => setRating(newValue)}
                />
                {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={like}
                    onChange={(e) => setLike(e.target.checked)}
                  />
                }
                label="Like"
              /> */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasCookedBefore}
                      onChange={(e) => setHasCookedBefore(e.target.checked)}
                    />
                  }
                  label="I've made this recipe before"
                />
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LogRecipeButton;
