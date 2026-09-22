import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { displayIngredient } from "@/lib/ingredients/display";

interface Props {
  ingredients: { id: number; section: string | null; raw: string }[];
  stepCount: number;
  totalTimeMinutes: number | null;
  recipeYield: string | null;
  sourceUrl: string;
}

function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h && `${h} hr`, m && `${m} min`].filter(Boolean).join(" ");
}

/** Groups consecutive lines by section, preserving order. */
function groupBySection(ingredients: Props["ingredients"]) {
  const groups: { section: string | null; items: Props["ingredients"] }[] = [];
  for (const item of ingredients) {
    const last = groups[groups.length - 1];
    if (last && last.section === item.section) last.items.push(item);
    else groups.push({ section: item.section, items: [item] });
  }
  return groups;
}

export default function RecipeIngredients({
  ingredients,
  stepCount,
  totalTimeMinutes,
  recipeYield,
  sourceUrl,
}: Props) {
  const facts = [
    totalTimeMinutes && formatMinutes(totalTimeMinutes),
    recipeYield && `Serves ${recipeYield.replace(/\s*servings?$/i, "")}`,
    ingredients.length > 0 && `${ingredients.length} ingredients`,
  ].filter(Boolean) as string[];

  return (
    <Box>
      <Typography sx={eyebrow}>Ingredients</Typography>

      {facts.length > 0 && (
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 2.5 }}>
          {facts.map((fact) => (
            <Chip
              key={fact}
              label={fact}
              size="small"
              sx={{ fontSize: "0.7rem", bgcolor: "rgba(200,169,110,0.1)", color: "text.secondary" }}
            />
          ))}
        </Box>
      )}

      {groupBySection(ingredients).map(({ section, items }, i) => (
        <Box key={`${section ?? "main"}-${i}`} sx={{ mb: 2.5 }}>
          {section && (
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.9375rem",
                textTransform: "capitalize",
                mb: 1,
              }}
            >
              {section}
            </Typography>
          )}
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {items.map((item) => (
              <Box
                key={item.id}
                component="li"
                sx={{
                  display: "flex",
                  gap: 1.25,
                  py: 0.875,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontSize: "0.875rem",
                  color: "text.primary",
                  lineHeight: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    flexShrink: 0,
                    mt: "0.55em",
                  }}
                />
                {displayIngredient(item.raw)}
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 1 }}>
        {stepCount > 0 ? `${stepCount} steps` : "Full method"} on the{" "}
        <MuiLink href={sourceUrl} rel="noopener noreferrer" target="_blank">
          original recipe ↗
        </MuiLink>
      </Typography>
    </Box>
  );
}

const eyebrow = {
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#4a4744",
  mb: 2,
} as const;
