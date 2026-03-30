import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

interface Props {
  image: string;
  link: string;
  name: string;
}

export default function PopularCreatorCard({ image, link, name }: Props) {
  return (
    <Box
      component={NextLink}
      href={link}
      sx={{
        position: "relative",
        display: "block",
        borderRadius: "8px",
        overflow: "hidden",
        aspectRatio: "1",
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
      <Box
        alt={name}
        component="img"
        src={image}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          display: "block",
          transition: "transform 0.4s ease",
          filter: "grayscale(15%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)",
          display: "flex",
          alignItems: "flex-end",
          p: 1.25,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#fff",
            lineHeight: 1.3,
          }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
}
