import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Typography from "@mui/material/Typography";

import { RECIPE_LIST_TYPE } from "../../types";

interface Props {
  recipes: RECIPE_LIST_TYPE[];
}

function RecipeList(props: Props) {
  const { recipes } = props;

  return (
    <Grid container>
      <Grid
        item
        style={{
          borderBottom: "1px solid black",
          display: "flex",
          justifyContent: "space-between",
          lineHeight: "0",
          margin: "0 auto",
          width: "75%",
        }}
      >
        <Typography variant="h6" component="div">
          RECIPES
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
        {recipes.map((recipe: any, i: number) => (
          <RecipeCard
            key={`card-${i}`}
            name={recipe.name}
            link={recipe.link}
            image={recipe.image}
            website={recipe.website}
            instagram={recipe.instagram}
            youtube={recipe.youtube}
            sx={{
              height: "100%",
              width: "100%",
            }}
          />
        ))}
      </Grid>
    </Grid>
  );
}

function RecipeCard(props: any) {
  const recipeSlug = `/recipe/${props.name.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Grid item>
      <Link href={recipeSlug}>
        <Card
          sx={{
            height: "250px",
            width: "250px",
            cursor: "pointer",
          }}
        >
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
    </Grid>
  );
}

export default RecipeList;
