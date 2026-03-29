import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import Decimal from "decimal.js";
import StarRating from "../ui/StarRating";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  image: string;
  link: string;
  name: string;

  date?: Dayjs | string;
  rating?: number | Decimal;
  username?: string;
}

export default function RecipeCard({
  image,
  link,
  name,
  date,
  rating,
  username,
}: Props) {
  const numericRating =
    rating instanceof Decimal ? rating.toNumber() : (rating ?? null);

  const formattedDate = date ? dayjs(date).format("MMM D") : null;

  return (
    <Box
      component={NextLink}
      href={link}
      sx={{
        position: "relative",
        display: "block",
        borderRadius: "10px",
        overflow: "hidden",
        aspectRatio: "3/4",
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
        bgcolor: "#161616",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.16)",
          transform: "translateY(-2px)",
          "& .recipe-image": { transform: "scale(1.04)" },
        },
      }}
    >
      {/* Image */}
      <Box
        className="recipe-image"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.4s ease",
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {numericRating !== null && (
          <StarRating rating={numericRating} size="sm" />
        )}

        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.875rem",
            lineHeight: 1.3,
            color: "#fff",
          }}
        >
          {name}
        </Typography>

        {(username || formattedDate) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {username && (
              <Typography
                sx={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.5)" }}
              >
                {username}
              </Typography>
            )}
            {formattedDate && (
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {formattedDate}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
