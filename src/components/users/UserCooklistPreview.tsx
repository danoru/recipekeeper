import { Box, Grid, Typography } from "@mui/material";
import { Cooklist, Recipes } from "@prisma/client";

import { toSlug } from "../../data/helpers";
import TinyCard from "../cards/TinyCard";

interface Props {
  cooklist: (Cooklist & { recipes: Recipes })[];
}

function UserCooklistPreview({ cooklist }: Props) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            color: "text.disabled",
          }}
          variant="overline"
        >
          Cooklist
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {cooklist?.length ?? 0}
        </Typography>
      </Box>

      {cooklist?.length === 0 ? (
        <Typography color="text.disabled" sx={{ py: 2 }} variant="body2">
          Nothing on the cooklist yet.
        </Typography>
      ) : (
        <Grid container spacing={0.5}>
          {cooklist.map((item, i) => (
            <TinyCard
              key={`cooklist-${i}`}
              image={item.recipes.image}
              link={`/recipes/${toSlug(item.recipes.name)}`}
              name={item.recipes.name}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}
export default UserCooklistPreview;
