import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import RecipeCard from "../cards/RecipeCard";
import SectionWrapper from "./SectionWrapper";
import { Recipes } from "@prisma/client";

import { toSlug } from "../../data/helpers";

interface Props {
  recipes: Recipes[];
}

export default function FavoriteRecipes({ recipes }: Props) {
  return (
    <SectionWrapper
      title="Favorite Recipes"
      empty={recipes.length === 0}
      emptyText={<EmptyPrompt label="Browse recipes" href="/recipes" />}
    >
      <Grid container spacing={1.5}>
        {recipes.map((recipe, i) => (
          <Grid key={`recipe-${i}`} item xs={6} sm={4} md={3}>
            <RecipeCard
              name={recipe.name}
              link={`/recipes/${toSlug(recipe.name)}`}
              image={recipe.image}
            />
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
}

function EmptyPrompt({ label, href }: { label: string; href: string }) {
  return (
    <Box sx={{ py: 3, display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" color="text.disabled">
        Nothing here yet.
      </Typography>
      <MuiLink
        href={href}
        underline="hover"
        sx={{
          fontSize: "0.875rem",
          color: "primary.main",
          "&:hover": { color: "primary.light" },
        }}
      >
        {label} →
      </MuiLink>
    </Box>
  );
}
