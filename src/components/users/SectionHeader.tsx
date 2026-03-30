import { Box, Typography } from "@mui/material";

export default function SectionHeader({ title }: { title: string }) {
  return (
    <Box sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1, mb: 2 }}>
      <Typography
        sx={{
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          color: "text.disabled",
        }}
        variant="overline"
      >
        {title}
      </Typography>
    </Box>
  );
}
