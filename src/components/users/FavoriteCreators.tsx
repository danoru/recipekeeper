import { Box, Grid, Link as MuiLink, Typography } from "@mui/material";
import { Creators } from "@prisma/client";

import CreatorCard from "../cards/CreatorCard";

import SectionWrapper from "./SectionWrapper";

interface Props {
  creators: Creators[];
}

export default function FavoriteCreators({ creators }: Props) {
  return (
    <SectionWrapper
      empty={creators.length === 0}
      emptyText={<EmptyPrompt href="/creators" label="Discover a creator" />}
      title="Favorite Creators"
    >
      <Grid container spacing={1.5}>
        {creators.map((creator, i) => (
          <Grid key={`creator-${i}`} size={{ xs: 6, sm: 4, md: 3 }}>
            <CreatorCard
              image={creator.image}
              link={`/creators/${creator.link}`}
              name={creator.name}
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
      <Typography color="text.disabled" variant="body2">
        Nothing here yet.
      </Typography>
      <MuiLink
        href={href}
        sx={{
          fontSize: "0.875rem",
          color: "primary.main",
          "&:hover": { color: "primary.light" },
        }}
        underline="hover"
      >
        {label} →
      </MuiLink>
    </Box>
  );
}
