import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function PopCard() {
  return (
    <Card sx={{ width: "250px", height: "335px" }}>
      <CardMedia
        sx={{ height: 140 }}
        image="../../../public/images/error.png"
        title="error"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Recipe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Recipes are a a set of instructions for preparing a particular dish,
          including a list of the ingredients required.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default PopCard;
