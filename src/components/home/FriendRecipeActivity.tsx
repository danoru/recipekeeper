import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Decimal from "decimal.js";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";
import moment from "moment";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { DiaryEntries, Recipes, Users } from "@prisma/client";

interface Props {
  recentEntries: (DiaryEntries & { users: Users; recipes: Recipes })[];
}

interface CardProps {
  name: string;
  image: string;
  rating: Decimal;
  username: string;
  date: Date;
  sx: any;
}

function FriendRecipeActivity({ recentEntries }: Props) {
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
          NEW RECIPES FROM FRIENDS
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
        {recentEntries?.map(
          (
            entry: DiaryEntries & { users: Users; recipes: Recipes },
            i: number
          ) => {
            return (
              <RecipeCard
                key={`card-${i}`}
                name={entry.recipes.name}
                image={entry.recipes.image}
                rating={entry.rating}
                date={entry.date}
                username={entry.users.username}
                sx={{
                  height: "100%",
                  width: "100%",
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
      <Link href={recipeSlug} underline="none">
        <Card
          sx={{
            height: "300px",
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
            <Typography variant="body1" component="div">
              {card.name}
            </Typography>
            <Typography variant="body2" component="div">
              {card.username}
            </Typography>
            <Rating value={rating} size="small" readOnly />
            <Typography variant="body2" component="div">
              {moment(card.date).format("MMM DD")}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default FriendRecipeActivity;
