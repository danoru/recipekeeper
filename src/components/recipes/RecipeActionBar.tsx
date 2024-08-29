import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/FavoriteOutlined";
import Link from "@mui/material/Link";
import MenuBook from "@mui/icons-material/MenuBook";
import MenuBookTwoTone from "@mui/icons-material/MenuBookTwoTone";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OutdoorGrill from "@mui/icons-material/OutdoorGrill";
import OutdoorGrillOutlined from "@mui/icons-material/OutdoorGrillOutlined";
import { Cooklist, DiaryEntries, LikedRecipes, Recipes } from "@prisma/client";

interface Props {
  cooklist: Cooklist[];
  diaryEntries: DiaryEntries[];
  likedRecipes: LikedRecipes[];
  recipe: Recipes;
  sessionUser: any;
}

function RecipeActionBar({
  cooklist,
  diaryEntries,
  likedRecipes,
  recipe,
  sessionUser,
}: Props) {
  const userId = sessionUser ? Number(sessionUser.id) : null;
  const recipeId = recipe.id;
  const [copied, setCopied] = useState(false);
  const [cookHovered, setCookHovered] = useState(false);
  const [cooklistHovered, setCooklistHovered] = useState(false);
  const [likedHovered, setLikedHovered] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const copyUrlToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setSnackbarMessage("Successfully copied.");
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        setSnackbarMessage("Failed to copy.");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
      });
  };

  const [hasCooked, setHasCooked] = useState(
    userId ? diaryEntries?.some((a) => a.userId === userId) : false
  );

  const [isCooklisted, setIsCooklisted] = useState(
    userId ? cooklist.some((w) => w.userId === userId) : false
  );

  const [isLiked, setIsLiked] = useState(
    userId ? likedRecipes.some((l) => l.userId === userId) : false
  );

  async function handleCooklist() {
    if (sessionUser) {
      const method = isCooklisted ? "DELETE" : "POST";
      const response = await fetch(`/api/recipes/cooklist`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userId,
          method,
          recipeId,
          userId,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsCooklisted(!isCooklisted);
        setSnackbarMessage(
          isCooklisted
            ? "Successfully removed from cooklist."
            : "Successfully added to cooklist."
        );
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(data.error || "Failed to update cooklist.");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    }
  }

  async function handleLikes() {
    if (sessionUser) {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(`/api/recipes/likes`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method,
          recipeId,
          userId,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsLiked(!isLiked);
        setSnackbarMessage(
          isLiked
            ? "Successfully removed from liked recipes."
            : "Successfully added to liked recipes."
        );
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(data.error || "Failed to update liked recipes.");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    }
  }

  const CookButton = () => {
    return (
      <Stack direction="column" alignItems="center" width="33%">
        <Button
          onMouseEnter={() => setCookHovered(true)}
          onMouseLeave={() => setCookHovered(false)}
        >
          <Typography variant="subtitle1">
            {hasCooked ? (
              <OutdoorGrill fontSize="large" />
            ) : (
              <OutdoorGrillOutlined fontSize="large" />
            )}
          </Typography>
        </Button>
        <Typography variant="subtitle1">
          {hasCooked ? (cookHovered ? "Remove" : "Cooked") : "Cook"}
        </Typography>
      </Stack>
    );
  };

  const LikedButton = () => {
    return (
      <Stack direction="column" alignItems="center" width="33%">
        <Button
          onClick={handleLikes}
          onMouseEnter={() => setLikedHovered(true)}
          onMouseLeave={() => setLikedHovered(false)}
        >
          <Typography variant="subtitle1">
            {isLiked ? (
              <FavoriteIcon fontSize="large" />
            ) : (
              <FavoriteBorder fontSize="large" />
            )}
          </Typography>
        </Button>
        <Typography variant="subtitle1">
          {isLiked ? (likedHovered ? "Remove" : "Liked") : "Like"}
        </Typography>
      </Stack>
    );
  };

  const CooklistButton = () => {
    return (
      <Stack direction="column" alignItems="center" width="33%">
        <Button
          onClick={handleCooklist}
          onMouseEnter={() => setCooklistHovered(true)}
          onMouseLeave={() => setCooklistHovered(false)}
        >
          <Typography variant="subtitle1">
            {isCooklisted ? (
              <MenuBook fontSize="large" />
            ) : (
              <MenuBookTwoTone fontSize="large" />
            )}
          </Typography>
        </Button>
        <Typography variant="subtitle1">
          {isCooklisted
            ? cooklistHovered
              ? "Remove"
              : "Cooklist"
            : "Cooklist"}
        </Typography>
      </Stack>
    );
  };

  return (
    <Paper sx={{ borderRadius: "1%" }}>
      {sessionUser ? (
        <>
          <Stack direction="row" justifyContent="center">
            <CookButton />
            <LikedButton />
            <CooklistButton />
          </Stack>
          <Divider />
          <Stack alignItems="center" padding="1vh 0">
            <Typography variant="subtitle1">Rate</Typography>
            <Rating />
          </Stack>
          <Divider />
          <Typography
            variant="subtitle1"
            style={{ padding: "1vh 0", textAlign: "center" }}
          >
            Review
          </Typography>
          <Divider />
          <Typography
            variant="subtitle1"
            style={{ padding: "1vh 0", textAlign: "center" }}
          >
            Add to Lists
          </Typography>
        </>
      ) : (
        <Link href="/login" underline="none">
          <Typography
            variant="subtitle1"
            style={{ padding: "1vh 0", textAlign: "center" }}
            color="text.primary"
          >
            Login to Log, Rate or Review
          </Typography>
        </Link>
      )}
      <Divider />
      <Link href={recipe.link} underline="none">
        <Typography
          variant="subtitle1"
          style={{ padding: "1vh 0", textAlign: "center" }}
          color="text.primary"
        >
          View Recipe
        </Typography>
      </Link>
      <Divider />
      <Button
        fullWidth
        onClick={copyUrlToClipboard}
        sx={{
          color: "text.primary",
          padding: "1vh 0",
          textAlign: "center",
          textTransform: "none",
        }}
      >
        <Typography variant="subtitle1">Share</Typography>
      </Button>
    </Paper>
  );
}

export default RecipeActionBar;
