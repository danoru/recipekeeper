import Grid from "@mui/material/Grid";
import { RECIPE_LIST_TYPE } from "../../types";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

interface CooklistProps {
  cooklist: RECIPE_LIST_TYPE[];
}

interface RecipeCardProps {
  name: string;
  image: string;
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
        {cooklist.map((recipe, i: number) => (
          <RecipeCard
            key={`card-${i}`}
            name={recipe.name}
            image={recipe.image}
          />
        ))}
      </Grid>
    </Grid>
  );
}

function RecipeCard({ name, image }: RecipeCardProps) {
  const recipeSlug = `/recipe/${name.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Grid item>
      <Link href={recipeSlug}>
        <Card
          sx={{
            height: "105px",
            width: "70px",
            cursor: "pointer",
          }}
        >
          <CardMedia sx={{ height: "105px" }} image={image} title={name} />
        </Card>
      </Link>
    </Grid>
  );
}

export default UserCooklistPreview;
