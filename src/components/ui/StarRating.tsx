import Box from "@mui/material/Box";

interface Props {
  rating: number; // 0–5, supports 0.5 steps
  size?: "sm" | "md";
}

export default function StarRating({ rating, size = "sm" }: Props) {
  const fontSize = size === "md" ? 14 : 11;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating >= i + 1;
    const half = !filled && rating >= i + 0.5;
    return { filled, half };
  });

  return (
    <Box sx={{ display: "flex", gap: "1px", alignItems: "center" }}>
      {stars.map((s, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            fontSize,
            lineHeight: 1,
            color: s.filled
              ? "#e6b84a"
              : s.half
                ? "rgba(230,184,74,0.55)"
                : "rgba(255,255,255,0.18)",
          }}
        >
          ★
        </Box>
      ))}
    </Box>
  );
}
