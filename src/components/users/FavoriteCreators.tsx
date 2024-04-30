import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Typography from "@mui/material/Typography";

import { CREATOR_LIST_TYPE } from "../../types";

interface Props {
  creators: CREATOR_LIST_TYPE[];
}
function FavoriteCreators(props: Props) {
  const { creators } = props;

  return (
    <Grid container item xs={8}>
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
        {creators.map((creator: any, i: number) => (
          <CreatorCard
            key={`card-${i}`}
            name={creator.name}
            link={`creators/${creator.link}`}
            image={creator.image}
            website={creator.website}
            instagram={creator.instagram}
            youtube={creator.youtube}
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        ))}
      </Grid>
    </Grid>
  );
}

function CreatorCard(props: any) {
  return (
    <Grid item>
      <Link href={props.link}>
        <Card
          sx={{
            width: "200px",
            height: "250px",
            cursor: "pointer",
          }}
        >
          <CardMedia
            sx={{ height: 140 }}
            image={props.image}
            title={props.name}
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {props.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default FavoriteCreators;
