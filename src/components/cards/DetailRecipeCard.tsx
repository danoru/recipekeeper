import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Decimal from "decimal.js";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import moment from "moment";
import Rating from "@mui/material/Rating";

interface Props {
  date: Date;
  image: string;
  link: string;
  name: string;
  rating: Decimal;
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
  const recipeRating = new Decimal(rating).toNumber();
  return (
    <Grid item>
      <Card
        sx={{
          position: "relative",
          height: "270px",
          width: "211.5px",
          overflow: "hidden",
          "&:hover": {
            ".overlay": {
              borderColor: "white",
            },
            ".image": {
              filter: "brightness(0.8)",
            },
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
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              filter: "brightness(0.5)",
              transition: "filter 0.3s",
            }}
          />
          <Box
            className="overlay"
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              bottom: "5px",
              left: "5px",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              pointerEvents: "none",
              transition: "border-color 0.3s",
            }}
          />
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              sx={{
                position: "relative",
                color: "white",
                textShadow: "0 0 5px rgba(0, 0, 0, 0.7)",
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{
                position: "relative",
                color: "white",
                textShadow: "0 0 5px rgba(0, 0, 0, 0.7)",
              }}
            >
              {username}
            </Typography>
            <Rating value={recipeRating} size="small" readOnly />
            <Typography
              variant="body1"
              component="div"
              sx={{
                position: "relative",
                color: "white",
                textShadow: "0 0 5px rgba(0, 0, 0, 0.7)",
              }}
            >
              {moment(date).format("MMM DD")}
            </Typography>
          </CardContent>
        </Link>
      </Card>
    </Grid>
  );
}

export default DetailRecipeCard;
