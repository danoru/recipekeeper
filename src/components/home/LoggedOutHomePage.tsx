import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function LoggedOutHomePage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 52px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        gap: 0,
      }}
    >
      {/* Eyebrow */}
      <Typography
        sx={{
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#4a4744",
          mb: 3,
        }}
      >
        The social network for food lovers
      </Typography>

      {/* Hero heading */}
      <Box sx={{ mb: 4 }}>
        {[
          "Track recipes you've made.",
          "Save those you want to eat.",
          "Tell your friends what's good.",
        ].map((line, i) => (
          <Typography
            key={i}
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
              fontWeight: 400,
              lineHeight: 1.25,
              color: i === 0 ? "text.primary" : i === 1 ? "#888580" : "#4a4744",
              mb: 0.5,
            }}
          >
            {line}
          </Typography>
        ))}
      </Box>

      {/* CTA */}
      <Button
        variant="contained"
        href="/login"
        size="large"
        sx={{
          px: 4,
          py: 1.25,
          fontSize: "0.8125rem",
          fontWeight: 500,
          letterSpacing: "0.06em",
          borderRadius: "8px",
        }}
      >
        Get started — it&apos;s free
      </Button>
    </Box>
  );
}
