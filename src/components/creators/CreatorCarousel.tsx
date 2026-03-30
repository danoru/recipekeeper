import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Creators } from "@prisma/client";
import React, { useState } from "react";

import CreatorCard from "../cards/CreatorCard";

interface Props {
  creators: Creators[];
}
function CreatorCarousel({ creators }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"right" | "left" | undefined>("left");

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
    <Grid container size={{ xs: 12 }}>
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
        <Typography component="div" variant="h6">
          FEATURED CREATORS
        </Typography>
      </Grid>
      <Grid
        style={{
          display: "flex",
          justifyContent: "center",
          height: "400px",
          margin: "10px auto",
        }}
      >
        <IconButton disabled={currentPage === 0} sx={{ margin: 5 }} onClick={handlePrevPage}>
          <NavigateBeforeIcon />
        </IconButton>
        <Box sx={{ width: `${containerWidth}px`, height: "100%" }}>
          <Slide direction={slideDirection} in={true}>
            <Stack
              alignContent="center"
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ width: "100%", height: "100%" }}
            >
              {creators
                .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
                .map((creator: any, i: number) => (
                  <CreatorCard
                    key={`card-${i}`}
                    image={creator.image}
                    link={`creators/${creator.link}`}
                    name={creator.name}
                  />
                ))}
            </Stack>
          </Slide>
        </Box>
        <IconButton
          disabled={currentPage >= Math.ceil((creators.length || 0) / cardsPerPage) - 1}
          sx={{
            margin: 5,
          }}
          onClick={handleNextPage}
        >
          <NavigateNextIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default CreatorCarousel;
