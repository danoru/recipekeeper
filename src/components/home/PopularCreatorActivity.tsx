import CreatorCard from "../cards/CreatorCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Creators } from "@prisma/client";

interface Props {
  creators: Creators[];
}

function PopularCreatorActivity({ creators }: Props) {
  return (
    <Grid container>
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
        <Typography variant="overline" component="div">
          CREATORS POPULAR WITH FRIENDS
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
        {creators.slice(0, 5).map((creator, i) => {
          return (
            <CreatorCard
              key={`card-${i}`}
              name={creator.name}
              image={creator.image}
              link={`creators/${creator.link}`}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

export default PopularCreatorActivity;
