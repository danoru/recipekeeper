import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { Cooklist, Recipes } from "@prisma/client";

interface CooklistProps {
  cooklist: (Cooklist & { recipes: Recipes })[];
}

interface RecipeCardProps {
  image: string;
  link: string;
  name: string;
}

function UserCooklistPreview({ cooklist }: CooklistProps) {
  return (
    <Grid item>
      <Grid
        container
        sx={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          justifyContent: "space-between",
          margin: "10px 0",
          maxWidth: "50%",
        }}
      >
        <Grid item>COOKLIST</Grid>
        <Grid item>{cooklist?.length}</Grid>
      </Grid>
      <Grid container>
        {cooklist.map((item, i: number) => (
          <TinyCard
            key={`card-${i}`}
            image={item.recipes.image}
            link={`/recipes/${item.recipes.name
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
            name={item.recipes.name}
          />
        ))}
      </Grid>
    </Grid>
  );
}

function TinyCard({ image, link, name }: RecipeCardProps) {
  return (
    <Tooltip title={name}>
      <Grid item sx={{ margin: "2px" }}>
        <Link href={link}>
          <Card
            sx={{
              position: "relative",
              height: "105px",
              width: "70px",
              cursor: "pointer",
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
            <CardMedia
              className="image"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                filter: "brightness(0.5)",
                transition: "filter 0.3s",
              }}
            >
              <Image
                src={image}
                alt={name}
                fill
                style={{ objectFit: "cover" }}
              />
            </CardMedia>
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
          </Card>
        </Link>
      </Grid>
    </Tooltip>
  );
}

export default UserCooklistPreview;
