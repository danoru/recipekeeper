import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { DiaryEntries, Recipes } from "@prisma/client";
import Decimal from "decimal.js";

interface Props {
  diaryEntries: (DiaryEntries & { recipes: Recipes })[];
}

interface CardProps {
  name: string;
  image: string;
  rating: Decimal;
  sx: any;
}

function UserRecentRecipes({ diaryEntries }: Props) {
  const userDiary = diaryEntries.slice(0, 3);
  return (
    <Grid item>
      <Grid
        item
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "theme.palette.secondary",
          display: "flex",
          justifyContent: "space-between",
          margin: "0 auto",
          width: "75%",
        }}
      >
        <Typography variant="h6" component="div">
          RECENT ACTIVITY
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
        {userDiary.map(
          (entry: DiaryEntries & { recipes: Recipes }, i: number) => {
            return (
              <RecipeCard
                key={`card-${i}`}
                name={entry.recipes.name}
                image={entry.recipes.image}
                rating={entry.rating}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              />
            );
          }
        )}
      </Grid>
    </Grid>
  );
}

function RecipeCard(card: CardProps) {
  const recipeSlug = `/recipe/${card.name.replace(/\s+/g, "-").toLowerCase()}`;
  const rating = new Decimal(card.rating).toNumber();
  return (
    <Grid item>
      <Link href={recipeSlug}>
        <Card
          sx={{
            width: "200px",
            height: "200px",
            cursor: "pointer",
          }}
        >
          <CardMedia
            style={{ position: "relative", height: 140, width: "100%" }}
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
          <CardContent>
            <Rating value={rating} precision={0.5} readOnly />
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default UserRecentRecipes;
