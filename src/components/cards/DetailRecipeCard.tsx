import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

interface Props {
  date: string;
  image: string;
  link: string;
  name: string;
  rating: number;
  username?: string;
}

function DetailRecipeCard({
  date,
  image,
  link,
  name,
  rating,
  username,
}: Props) {
  return (
    <Grid item>
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
            title={name}
            sx={{
              position: "absolute",
              inset: 0,
              filter: "brightness(0.5)",
              transition: "filter 0.3s",
            }}
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
            <Typography
              variant="h6"
              sx={{ color: "white", textShadow: "0 0 5px rgba(0,0,0,0.7)" }}
            >
              {name}
            </Typography>
            {username && (
              <Typography
                variant="body1"
                sx={{ color: "white", textShadow: "0 0 5px rgba(0,0,0,0.7)" }}
              >
                {username}
              </Typography>
            )}
            <Rating value={rating} size="small" readOnly />
            <Typography
              variant="body1"
              sx={{ color: "white", textShadow: "0 0 5px rgba(0,0,0,0.7)" }}
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
