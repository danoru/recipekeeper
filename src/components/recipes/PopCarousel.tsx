import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import PopCard from "./PopCard";

function PopCarousel() {
  const [cards, setCards] = useState<React.ReactElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<
    "right" | "left" | undefined
  >("left");

  const cardsPerPage = 4;
  const duplicateCards: React.ReactElement[] = Array.from(
    { length: 10 },
    (_, i) => <PopCard key={i} />
  );

  const handleNextPage = () => {
    setSlideDirection("left");
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setSlideDirection("right");
    setCurrentPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    setCards(duplicateCards);
  }, []);

  const containerWidth = cardsPerPage * 250; // 250px per card

  return (
    <Grid container>
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
        <p>POPULAR RECIPES THIS WEEK</p>
        <Link href="/recipes/popular/week">
          <p>MORE</p>
        </Link>
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
          {cards.map((card, index) => (
            <Box
              key={`card-${index}`}
              sx={{
                width: "100%",
                height: "100%",
                display: currentPage === index ? "block" : "none",
              }}
            >
              <Slide direction={slideDirection} in={currentPage === index}>
                <Stack
                  spacing={2}
                  direction="row"
                  alignContent="center"
                  justifyContent="center"
                  sx={{ width: "100%", height: "100%" }}
                >
                  {cards.slice(
                    index * cardsPerPage,
                    index * cardsPerPage + cardsPerPage
                  )}
                </Stack>
              </Slide>
            </Box>
          ))}
        </Box>
        <IconButton
          onClick={handleNextPage}
          sx={{
            margin: 5,
          }}
          disabled={
            currentPage >= Math.ceil((cards.length || 0) / cardsPerPage) - 1
          }
        >
          <NavigateNextIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default PopCarousel;
