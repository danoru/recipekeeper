import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";
import { Cooklist, Recipes } from "@prisma/client";

interface CooklistProps {
  cooklist: (Cooklist & { recipes: Recipes })[];
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
        {cooklist.map((item, i: number) => (
          <RecipeCard
            key={`card-${i}`}
            name={item.recipes.name}
            image={item.recipes.image}
          />
        ))}
      </Grid>
    </Grid>
  );
}

function RecipeCard({ name, image }: RecipeCardProps) {
  const recipeSlug = `/recipes/${name.replace(/\s+/g, "-").toLowerCase()}`;
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
            style={{ position: "relative", height: 140, width: "100%" }}
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
        </Card>
      </Link>
    </Grid>
  );
}

export default UserCooklistPreview;
