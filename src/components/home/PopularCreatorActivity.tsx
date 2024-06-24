import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Creators, Users } from "@prisma/client";

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
        {creators.slice(0, 4).map((creator, i) => {
          return (
            <CreatorCard
              key={`card-${i}`}
              name={creator.name}
              image={creator.image}
              link={`creators/${creator.link}`}
              sx={{
                height: "100%",
                width: "100%",
              }}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

function CreatorCard(card: any) {
  return (
    <Grid item>
      <Link href={card.link} underline="none">
        <Card
          sx={{
            width: "250px",
            height: "250px",
            cursor: "pointer",
          }}
        >
          <CardMedia
            style={{ position: "relative", height: 140, width: "100%" }}
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
          <CardContent>
            <Typography variant="h6" component="div">
              {card.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default PopularCreatorActivity;
