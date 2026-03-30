import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/FavoriteOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import OutdoorGrillOutlinedIcon from "@mui/icons-material/OutdoorGrillOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { Cooklist, DiaryEntries, LikedRecipes, Recipes } from "@prisma/client";
import NextLink from "next/link";
import React, { useState } from "react";

interface Props {
  cooklist: Cooklist[];
  diaryEntries: DiaryEntries[];
  likedRecipes: LikedRecipes[];
  recipe: Recipes;
  sessionUser: any;
}

export default function RecipeActionBar({
  cooklist,
  diaryEntries,
  likedRecipes,
  recipe,
  sessionUser,
}: Props) {
  const userId = sessionUser ? Number(sessionUser.id) : null;
  const recipeId = recipe.id;

  const [hasCooked, setHasCooked] = useState(
    userId ? diaryEntries?.some((e) => e.userId === userId) : false
  );
  const [isCooklisted, setIsCooklisted] = useState(
    userId ? cooklist.some((c) => c.userId === userId) : false
  );
  const [isLiked, setIsLiked] = useState(
    userId ? likedRecipes.some((l) => l.userId === userId) : false
  );
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCooklist = async () => {
    if (!sessionUser) return;
    const res = await fetch("/api/recipes/cooklist", {
      method: isCooklisted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recipeId }),
    });
    if (res.ok) setIsCooklisted(!isCooklisted);
  };

  const handleLikes = async () => {
    if (!sessionUser) return;
    const res = await fetch("/api/recipes/likes", {
      method: isLiked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recipeId }),
    });
    if (res.ok) setIsLiked(!isLiked);
  };

  return (
    <Box
      sx={{
        bgcolor: "#161616",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        overflow: "hidden",
        minWidth: 140,
      }}
    >
      {sessionUser ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              py: 1.25,
              px: 0.5,
            }}
          >
            <ActionButton
              active={hasCooked}
              icon={
                hasCooked ? (
                  <OutdoorGrillIcon fontSize="small" />
                ) : (
                  <OutdoorGrillOutlinedIcon fontSize="small" />
                )
              }
              label={hasCooked ? "Cooked" : "Cook"}
              onClick={() => {}}
            />
            <ActionButton
              active={isLiked}
              icon={
                isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )
              }
              label={isLiked ? "Liked" : "Like"}
              onClick={handleLikes}
            />
            <ActionButton
              active={isCooklisted}
              icon={
                isCooklisted ? (
                  <MenuBookIcon fontSize="small" />
                ) : (
                  <MenuBookTwoToneIcon fontSize="small" />
                )
              }
              label="Cooklist"
              onClick={handleCooklist}
            />
          </Box>
          <Divider />
          <Box sx={{ px: 2, py: 1.25, textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "0.6875rem",
                color: "text.disabled",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Rate or review
            </Typography>
          </Box>
          <Divider />
        </>
      ) : (
        <>
          <MuiLink component={NextLink} href="/login" sx={{ display: "block" }} underline="none">
            <Typography
              sx={{
                fontSize: "0.8125rem",
                color: "text.secondary",
                textAlign: "center",
                py: 1.5,
                px: 2,
                transition: "color 0.15s",
                "&:hover": { color: "text.primary" },
              }}
            >
              Login to log, rate or review
            </Typography>
          </MuiLink>
          <Divider />
        </>
      )}

      {recipe.link && (
        <>
          <MuiLink
            href={recipe.link}
            rel="noopener noreferrer"
            sx={{ display: "block" }}
            target="_blank"
            underline="none"
          >
            <Typography
              sx={{
                fontSize: "0.8125rem",
                color: "text.secondary",
                textAlign: "center",
                py: 1.5,
                px: 2,
                transition: "color 0.15s",
                "&:hover": { color: "text.primary" },
              }}
            >
              View recipe ↗
            </Typography>
          </MuiLink>
          <Divider />
        </>
      )}

      <Button
        disableRipple
        fullWidth
        sx={{
          fontSize: "0.8125rem",
          color: copied ? "primary.main" : "text.secondary",
          textTransform: "none",
          py: 1.5,
          borderRadius: 0,
          "&:hover": { bgcolor: "transparent", color: "text.primary" },
          transition: "color 0.15s",
        }}
        onClick={handleShare}
      >
        {copied ? "Copied!" : "Share"}
      </Button>
    </Box>
  );
}

function ActionButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        cursor: "pointer",
        py: 0.5,
        px: 0.75,
        borderRadius: "6px",
        transition: "background 0.15s",
        "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          color: active ? "primary.main" : "text.disabled",
          display: "flex",
          transition: "color 0.15s",
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: "0.5625rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: active ? "primary.main" : "text.disabled",
          transition: "color 0.15s",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
