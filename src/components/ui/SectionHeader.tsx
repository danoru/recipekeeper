import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

interface Props {
  label: string;
  href?: string;
}

export default function SectionHeader({ label, href }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        mb: 2.5,
        pb: 1.5,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Typography
        sx={{ fontSize: "0.625rem", letterSpacing: "0.14em", color: "#4a4744" }}
        variant="overline"
      >
        {label}
      </Typography>
      {href && (
        <MuiLink
          component={NextLink}
          href={href}
          sx={{
            fontSize: "0.6875rem",
            color: "rgba(200,169,110,0.7)",
            letterSpacing: "0.06em",
            transition: "color 0.15s",
            "&:hover": { color: "#c8a96e" },
          }}
          underline="none"
        >
          See all →
        </MuiLink>
      )}
    </Box>
  );
}
