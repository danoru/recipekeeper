import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
  username: string;
  match: { shared: number; agreement: number };
}

export default function TasteMatch({ username, match }: Props) {
  const percent = Math.round(match.agreement * 100);

  return (
    <Box
      sx={{
        bgcolor: "#161616",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        p: 2.25,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          lineHeight: 1,
          color: "primary.main",
        }}
      >
        {percent}%
      </Typography>
      <Box>
        <Typography sx={{ fontSize: "0.5625rem", letterSpacing: "0.14em", color: "#4a4744" }}>
          TASTE MATCH
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", lineHeight: 1.4 }}>
          You and {username} agree on {percent}% of the {match.shared} recipes you&apos;ve both
          cooked.
        </Typography>
      </Box>
    </Box>
  );
}
