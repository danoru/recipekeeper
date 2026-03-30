import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Recipes } from "@prisma/client";

import { toSlug } from "../../data/helpers";
import RecipeCard from "../cards/RecipeCard";

import SectionWrapper from "./SectionWrapper";


interface Props {
  recipes: Recipes[];
}

export default function FavoriteRecipes({ recipes }: Props) {
  return (
    <SectionWrapper
      empty={recipes.length === 0}
      emptyText={<EmptyPrompt href="/recipes" label="Browse recipes" />}
      title="Favorite Recipes"
    >
      <Grid container spacing={1.5}>
        {recipes.map((recipe, i) => (
          <Grid key={`recipe-${i}`} size={{ xs: 6, sm: 4, md: 3 }}>
            <RecipeCard
              image={recipe.image}
              link={`/recipes/${toSlug(recipe.name)}`}
              name={recipe.name}
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
      <Typography color="text.disabled" variant="body2">
        Nothing here yet.
      </Typography>
      <MuiLink
        href={href}
        sx={{
          fontSize: "0.875rem",
          color: "primary.main",
          "&:hover": { color: "primary.light" },
        }}
        underline="hover"
      >
        {label} →
      </MuiLink>
    </Box>
  );
}
