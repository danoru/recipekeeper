import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Creators } from "@prisma/client";

interface Props {
  creators: Creators[];
}

interface CardProps {
  image: string;
  link: string;
  name: string;
  sx: any;
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

function CreatorCard(creator: CardProps) {
  return (
    <Grid item>
      <Link href={creator.link} underline="none">
        <Card
          sx={{
            width: "200px",
            height: "250px",
            cursor: "pointer",
          }}
        >
          <CardMedia style={{ position: "relative", height: 140 }}>
            <Image
              src={creator.image}
              alt={creator.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
          <CardContent>
            <Typography variant="h6" component="div">
              {creator.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default FavoriteCreators;
