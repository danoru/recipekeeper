import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/FavoriteOutlined";
import Link from "@mui/material/Link";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import OutdoorGrillOutlinedIcon from "@mui/icons-material/OutdoorGrillOutlined";
import { Recipes } from "@prisma/client";

interface Props {
  likeStatus: boolean;
  recipe: Recipes;
}

function RecipeActionBar({ recipe, likeStatus }: Props) {
  const [copied, setCopied] = useState(false);
  const copyUrlToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const [isLiked, setIsLiked] = useState(likeStatus);

  return (
    <Paper sx={{ borderRadius: "1%" }}>
      <Stack direction="row" justifyContent="center">
        <Stack alignItems="center" padding="1vh 0" width="33%">
          <OutdoorGrillOutlinedIcon />
          <Typography variant="subtitle1">Cook</Typography>
        </Stack>
        <Stack alignItems="center" padding="1vh 0" width="33%">
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          <Typography variant="subtitle1">
            {isLiked ? "Liked" : "Like"}
          </Typography>
        </Stack>
        <Stack alignItems="center" padding="1vh 0" width="33%">
          <MenuBookTwoToneIcon />
          <Typography variant="subtitle1">Cooklist</Typography>
        </Stack>
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
