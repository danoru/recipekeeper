import Grid from "@mui/material/Grid";
import { RECIPE_LIST_TYPE } from "../../types";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

interface Props {
  cooklist: RECIPE_LIST_TYPE[];
}

function UserCooklistPreview(props: Props) {
  const { cooklist } = props;

  return (
    <div>
      <Grid
        container
        sx={{
          borderBottom: "1px solid black",
          justifyContent: "space-between",
          margin: "10px 0",
          maxWidth: "50%",
        }}
      >
        <Grid item>COOKLIST</Grid>
        <Grid item>{cooklist?.length}</Grid>
      </Grid>
      <Grid container>
        {cooklist.map((recipe: any, i: number) => (
          <RecipeCard
            key={`card-${i}`}
            name={recipe.name}
            link={recipe.link}
            image={recipe.image}
            website={recipe.website}
            instagram={recipe.instagram}
            youtube={recipe.youtube}
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        ))}
      </Grid>
    </div>
  );
}

function RecipeCard(props: any) {
  const recipeSlug = `/recipe/${props.name.replace(/\s+/g, "-").toLowerCase()}`;
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
          <CardMedia
            sx={{ height: "105px" }}
            image={props.image}
            title={props.name}
          />
        </Card>
      </Link>
    </Grid>
  );
}

export default UserCooklistPreview;
