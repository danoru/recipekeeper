import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CREATOR_LIST_TYPE } from "../../types";

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
          FEATURED CREATORS
        </Typography>
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
                    link={`creators/${creator.link}`}
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
    <Link href={props.link}>
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
      </Card>
    </Link>
  );
}

export default CreatorCarousel;
