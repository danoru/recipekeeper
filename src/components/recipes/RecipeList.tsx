import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import RecipeCard from "../cards/RecipeCard";
import SectionHeader from "../ui/SectionHeader";
import { Recipes } from "@prisma/client";

interface SerializedRecipe {
  id: number;
  name: string;
  image: string;
  [key: string]: any;
}

interface SerializedDiaryEntry {
  rating: number;
  [key: string]: any;
}

interface SerializedRecipeWithDiary extends SerializedRecipe {
  diaryEntries: SerializedDiaryEntry[];
}

interface Props {
  header: string;
  recipes: SerializedRecipeWithDiary[];
  moreHref?: string;
}

export default function RecipeList({ header, recipes, moreHref }: Props) {
  return (
    <Box>
      <SectionHeader label={header} href={moreHref} />
      <Grid container spacing={1.5}>
        {recipes.map((recipe, i) => (
          <Grid item xs={6} sm={4} md={3} key={`recipe-${i}`}>
            <RecipeCard
              name={recipe.name}
              image={recipe.image}
              link={`/recipes/${recipe.name.replace(/\s+/g, "-").toLowerCase()}`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
