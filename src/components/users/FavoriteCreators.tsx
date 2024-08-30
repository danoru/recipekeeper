import CreatorCard from "../cards/CreatorCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Creators } from "@prisma/client";

interface Props {
  creators: Creators[];
}

function FavoriteCreators({ creators }: Props) {
  return (
    <Grid item>
      <Grid
        item
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          display: "flex",
          justifyContent: "space-between",
          lineHeight: "0",
          margin: "0 auto",
          width: "75%",
        }}
      >
        <Typography variant="h6" component="div">
          FAVORITE CREATORS
        </Typography>
      </Grid>
      <Grid
        container
        item
        rowSpacing={1}
        columnSpacing={2}
        sx={{
          margin: "10px auto",
          maxWidth: "75%",
        }}
      >
        {creators.map((creator: Creators, i: number) => (
          <CreatorCard
            key={`card-${i}`}
            name={creator.name}
            link={`creators/${creator.link}`}
            image={creator.image}
          />
        ))}
      </Grid>
    </Grid>
  );
}

export default FavoriteCreators;
