import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Recipes } from "@prisma/client";

interface Props {
  recipes: Recipes[];
}

function PopCarousel({ recipes }: Props) {
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

  const containerWidth = cardsPerPage * 250;

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
        <p>POPULAR RECIPES THIS WEEK</p>
        <Link href="/recipes/popular/week" underline="none">
          <p style={{ cursor: "pointer" }}>MORE</p>
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
          <Slide direction={slideDirection} in={true}>
            <Stack
              spacing={2}
              direction="row"
              alignContent="center"
              justifyContent="center"
              sx={{ width: "100%", maxWidth: "1200px" }}
            >
              {recipes
                .slice(
                  currentPage * cardsPerPage,
                  (currentPage + 1) * cardsPerPage
                )
                .map((recipe: any, i: number) => (
                  <PopCard
                    key={`card-${i}`}
                    name={recipe.name}
                    description={recipe.description}
                    image={recipe.image}
                    underline="none"
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
          disabled={
            currentPage >= Math.ceil((recipes.length || 0) / cardsPerPage) - 1
          }
        >
          <NavigateNextIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

function PopCard(recipe: any) {
  const recipeSlug = `/recipes/${recipe.name
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  return (
    <Link href={recipeSlug} underline="none">
      <Card sx={{ width: "250px", height: "360px", cursor: "pointer" }}>
        <CardMedia style={{ position: "relative", height: 140, width: "100%" }}>
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="h6" component="div">
            {recipe.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipe.description}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PopCarousel;
