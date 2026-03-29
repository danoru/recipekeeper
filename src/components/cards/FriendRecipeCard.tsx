import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import StarRating from "../ui/StarRating";

interface Props {
  date: Date | string;
  image: string;
  link: string;
  name: string;
  rating: number;
  username: string;
}

export default function FriendRecipeCard({
  date,
  image,
  link,
  name,
  rating,
  username,
}: Props) {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Box
      component={NextLink}
      href={link}
      sx={{
        position: "relative",
        display: "block",
        borderRadius: "12px",
        overflow: "hidden",
        aspectRatio: "3/4",
        border: "1px solid rgba(255,255,255,0.07)",
        cursor: "pointer",
        textDecoration: "none",
        bgcolor: "#161616",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.14)",
          transform: "translateY(-2px)",
          "& img": { transform: "scale(1.04)" },
        },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.4s ease",
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: 1.75,
          gap: 0.5,
        }}
      >
        <StarRating rating={rating} size="sm" />

        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9375rem",
            lineHeight: 1.3,
            color: "#fff",
          }}
        >
          {name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
            {username}
          </Typography>
          <Typography sx={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {formatted}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
