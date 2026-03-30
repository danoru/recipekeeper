import { Box, Card, CardContent, CardMedia, Grid, Link, Rating, Typography } from "@mui/material";
import dayjs from "dayjs";

interface Props {
  date: string;
  image: string;
  link: string;
  name: string;
  rating: number;
  username?: string;
}

function DetailRecipeCard({ date, image, link, name, rating, username }: Props) {
  return (
    <Grid>
      <Card
        sx={{
          position: "relative",
          height: "270px",
          width: "211.5px",
          overflow: "hidden",
          "&:hover": {
            ".overlay": { borderColor: "white" },
            ".image": { filter: "brightness(0.8)" },
          },
        }}
      >
        <Link href={link} underline="none">
          <CardMedia
            className="image"
            image={image}
            sx={{
              position: "absolute",
              inset: 0,
              filter: "brightness(0.5)",
              transition: "filter 0.3s",
            }}
            title={name}
          />
          <Box
            className="overlay"
            sx={{
              position: "absolute",
              inset: "5px",
              border: "2px solid rgba(255,255,255,0.5)",
              pointerEvents: "none",
              transition: "border-color 0.3s",
            }}
          />
          <CardContent sx={{ position: "relative" }}>
            <Typography sx={{ color: "white", textShadow: "0 0 5px rgba(0,0,0,0.7)" }} variant="h6">
              {name}
            </Typography>
            {username && (
              <Typography
                sx={{ color: "white", textShadow: "0 0 5px rgba(0,0,0,0.7)" }}
                variant="body1"
              >
                {username}
              </Typography>
            )}
            <Rating readOnly size="small" value={rating} />
            <Typography
              sx={{ color: "white", textShadow: "0 0 5px rgba(0,0,0,0.7)" }}
              variant="body1"
            >
              {dayjs(date).format("MMM DD")}
            </Typography>
          </CardContent>
        </Link>
      </Card>
    </Grid>
  );
}

export default DetailRecipeCard;
