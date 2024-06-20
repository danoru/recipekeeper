import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Recipes } from "@prisma/client";

function LogRecipeButton() {
  const [modalOpen, modalSetOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipes | null>(null);
  const handleModalOpen = () => modalSetOpen(true);
  const handleModalClose = () => modalSetOpen(false);

  const recipes: any = [
    "Butternut Squash and Pork Lasagna",
    "Taiwanese American Chicken Pot Pie",
    "Banana Walnut Mochi Bread",
    "Chicken Pozole Verde",
    "Zuppa Tuscana Congee",
    "Slow Cooker White Chicken Chili",
    "Spicy Creamy Mushroom Pasta",
    "Middle Eastern Inspired Ground Beef Bowls",
    "Pressure Cooker Japanese Curry",
    "Cajun Sausage and Rice Skillet",
    "Taco Soup",
    "Oyakodon",
    "Black Pepper Stir Fried Udon",
  ];

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
          <Typography variant="h6">ADD TO YOUR RECIPES...</Typography>
          <Typography variant="caption" sx={{ marginTop: 2 }}>
            Name of Recipe
          </Typography>
          <Autocomplete
            options={recipes || []}
            value={selectedRecipe}
            onChange={(event, newValue) => setSelectedRecipe(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default LogRecipeButton;
