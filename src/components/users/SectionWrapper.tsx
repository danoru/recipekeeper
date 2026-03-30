import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SectionWrapperProps {
  title: string;
  empty: boolean;
  emptyText: React.ReactNode;
  children: React.ReactNode;
}

export default function SectionWrapper({ title, empty, emptyText, children }: SectionWrapperProps) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1,
          mb: 2,
        }}
      >
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
      {empty ? emptyText : children}
    </Box>
  );
}
