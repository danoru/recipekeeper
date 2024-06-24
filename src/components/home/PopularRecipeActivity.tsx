import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Recipes, Users } from "@prisma/client";

interface Props {
  recipes: Recipes[];
}

function PopularRecipeActivity({ recipes }: Props) {
  return (
    <Grid container>
      <Grid
        item
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
        <Typography variant="overline" component="div">
          RECIPES POPULAR WITH FRIENDS
        </Typography>
      </Grid>
      <Grid
        container
        item
        rowSpacing={1}
        columnSpacing={2}
        sx={{
          margin: "10px auto",
          maxWidth: "75%",
        }}
      >
        {recipes.slice(0, 4).map((recipe, i) => {
          return (
            <RecipeCard
              key={`card-${i}`}
              name={recipe.name}
              image={recipe.image}
              sx={{
                height: "100%",
                width: "100%",
              }}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}

function RecipeCard(card: any) {
  const recipeSlug = `/recipe/${card.name.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Grid item>
      <Link href={recipeSlug} underline="none">
        <Card
          sx={{
            height: "225px",
            width: "250px",
            cursor: "pointer",
          }}
        >
          <CardMedia style={{ position: "relative", height: 140 }}>
            <Image
              src={card.image}
              alt={card.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
          <CardContent>
            <Typography variant="h6" component="div">
              {card.name}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default PopularRecipeActivity;
