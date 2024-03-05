import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { CREATOR_LIST_TYPE } from "../../types";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

interface Props {
  creators: CREATOR_LIST_TYPE[];
}
function CreatorCarousel(props: Props) {
  const { creators } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<
    "right" | "left" | undefined
  >("left");

  const cardsPerPage = 4;

  const handleNextPage = () => {
    setSlideDirection("left");
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setSlideDirection("right");
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const containerWidth = cardsPerPage * 250; // 250px per card

  return (
    <Grid container item xs={12}>
      <Grid
        style={{
          borderBottom: "1px solid black",
          display: "flex",
          justifyContent: "space-between",
          lineHeight: "0",
          margin: "0 auto",
          width: "75%",
        }}
      >
        <p>POPULAR CREATORS THIS WEEK</p>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          justifyContent: "center",
          height: "400px",
          margin: "10px auto",
        }}
      >
        <IconButton
          onClick={handlePrevPage}
          sx={{ margin: 5 }}
          disabled={currentPage === 0}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <Box sx={{ width: `${containerWidth}px`, height: "100%" }}>
          <Slide direction={slideDirection} in={true}>
            <Stack
              spacing={2}
              direction="row"
              alignContent="center"
              justifyContent="center"
              sx={{ width: "100%", height: "100%" }}
            >
              {creators
                .slice(
                  currentPage * cardsPerPage,
                  (currentPage + 1) * cardsPerPage
                )
                .map((creator: any, i: number) => (
                  <CreatorCard
                    key={`card-${i}`}
                    name={creator.name}
                    image={creator.image}
                    website={creator.website}
                    instagram={creator.instagram}
                    youtube={creator.youtube}
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: currentPage === i ? "block" : "none",
                    }}
                  />
                ))}
            </Stack>
          </Slide>
        </Box>
        <IconButton
          onClick={handleNextPage}
          sx={{
            margin: 5,
          }}
          disabled={
            currentPage >= Math.ceil((creators.length || 0) / cardsPerPage) - 1
          }
        >
          <NavigateNextIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

function CreatorCard(props: any) {
  return (
    <Link href={props.website}>
      <Card sx={{ width: "250px", height: "250px", cursor: "pointer" }}>
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
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </Card>
    </Link>
  );
}

export default CreatorCarousel;
