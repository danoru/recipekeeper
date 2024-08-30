import Grid from "@mui/material/Grid";
import RecipeCard from "../cards/RecipeCard";
import Typography from "@mui/material/Typography";
import { Recipes } from "@prisma/client";

interface Props {
  header: string;
  recipes: Recipes[];
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
            link={`/recipes/${recipe.name.replace(/\s+/g, "-").toLowerCase()}`}
          />
        ))}
      </Grid>
    </Grid>
  );
}

export default RecipeList;
