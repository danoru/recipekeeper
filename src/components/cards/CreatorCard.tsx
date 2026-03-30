import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

interface Props {
  image: string;
  link: string;
  name: string;
}

export default function CreatorCard({ image, link, name }: Props) {
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
          "& .creator-image": { transform: "scale(1.04)" },
        },
      }}
    >
      <Box
        className="creator-image"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          filter: "grayscale(15%)",
          transition: "transform 0.4s ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)",
        }}
      />

      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 1.5 }}>
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
      </Box>
    </Box>
  );
}
