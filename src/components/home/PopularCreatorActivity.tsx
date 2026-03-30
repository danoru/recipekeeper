import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Creators } from "@prisma/client";
import { memo } from "react";

import PopularCreatorCard from "../cards/PopularCreatorCard";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  creators: Creators[];
}

function PopularCreatorActivity({ creators }: Props) {
  return (
    <Box sx={{ mb: 5 }}>
      <SectionHeader href="/creators" label="Creators popular with friends" />
      <Grid container spacing={1.25}>
        {creators.slice(0, 4).map((creator, i) => (
          <Grid key={`pop-creator-${i}`} size={{ sm: 3, xs: 6 }}>
            <PopularCreatorCard
              image={creator.image}
              link={`/creators/${creator.link}`}
              name={creator.name}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(PopularCreatorActivity);
