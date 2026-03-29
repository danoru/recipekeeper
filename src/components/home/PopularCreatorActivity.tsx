import { memo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Creators } from "@prisma/client";
import PopularCreatorCard from "../cards/PopularCreatorCard";
import SectionHeader from "../ui/SectionHeader";

interface Props {
  creators: Creators[];
}

function PopularCreatorActivity({ creators }: Props) {
  return (
    <Box sx={{ mb: 5 }}>
      <SectionHeader label="Creators popular with friends" href="/creators" />
      <Grid container spacing={1.25}>
        {creators.slice(0, 4).map((creator, i) => (
          <Grid item xs={6} sm={3} key={`pop-creator-${i}`}>
            <PopularCreatorCard
              name={creator.name}
              image={creator.image}
              link={`/creators/${creator.link}`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(PopularCreatorActivity);
