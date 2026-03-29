import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CreatorCard from "../cards/CreatorCard";
import SectionWrapper from "./SectionWrapper";
import { Creators } from "@prisma/client";

interface Props {
  creators: Creators[];
}

export default function FavoriteCreators({ creators }: Props) {
  return (
    <SectionWrapper
      title="Favorite Creators"
      empty={creators.length === 0}
      emptyText={<EmptyPrompt label="Discover a creator" href="/creators" />}
    >
      <Grid container spacing={1.5}>
        {creators.map((creator, i) => (
          <Grid key={`creator-${i}`} item xs={6} sm={4} md={3}>
            <CreatorCard
              name={creator.name}
              link={`/creators/${creator.link}`}
              image={creator.image}
            />
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
}

function EmptyPrompt({ label, href }: { label: string; href: string }) {
  return (
    <Box sx={{ py: 3, display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" color="text.disabled">
        Nothing here yet.
      </Typography>
      <MuiLink
        href={href}
        underline="hover"
        sx={{
          fontSize: "0.875rem",
          color: "primary.main",
          "&:hover": { color: "primary.light" },
        }}
      >
        {label} →
      </MuiLink>
    </Box>
  );
}
