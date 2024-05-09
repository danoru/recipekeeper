import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { RECIPE_LIST_TYPE } from "../../types";

interface Props {
  header: string;
  recipes: RECIPE_LIST_TYPE[];
  style?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | undefined;
}

function RecipeList({ header, recipes, style }: Props) {
  const styledHeader = header.toUpperCase();
  const typographyStyle = style || "h6";

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
        <Typography variant={typographyStyle} component="div">
          {styledHeader}
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
            image={recipe.image}
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
      <Link href={recipeSlug} underline="none">
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
