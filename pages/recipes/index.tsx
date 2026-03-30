import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { Recipes, Creators } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import superjson from "superjson";

import RecipeCard from "@/components/cards/RecipeCard";
import ImportRecipeModal from "@/components/modals/ImportRecipeModal";
import SectionHeader from "@/components/ui/SectionHeader";
import { getAllCreators } from "@/data/creators";
import { recipeHref, creatorHref } from "@/data/helpers";
import { getAllRecipes, getFilteredRecipes, getRecipesByRating } from "@/data/recipes";

// ── Types ─────────────────────────────────────────────────────────────────────

type View = "all" | "by-creator" | "popular" | "highest" | "lowest";

const FILTER_KEYS = ["cuisine", "category", "course", "method", "diet"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

const FILTER_LABELS: Record<FilterKey, string> = {
  cuisine: "Cuisine",
  category: "Category",
  course: "Course",
  method: "Method",
  diet: "Diet",
};

const VIEW_LABELS: Record<View, string> = {
  all: "All recipes",
  "by-creator": "By creator",
  popular: "Popular this week",
  highest: "Highest rated",
  lowest: "Lowest rated",
};

interface Props {
  recipes: (Recipes & { creators: Creators })[];
  creators: Creators[];
  filterOptions: Record<FilterKey, string[]>;
  activeFilters: Partial<Record<FilterKey, string>>;
  activeView: View;
  totalCount: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildHref(
  base: Partial<Record<FilterKey, string>> & { view?: View },
  overrides: Partial<Record<FilterKey, string>> & { view?: View }
): string {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();
  if (merged.view && merged.view !== "all") params.set("view", merged.view);
  for (const key of FILTER_KEYS) {
    if (merged[key]) params.set(key, merged[key]!);
  }
  const qs = params.toString();
  return `/recipes${qs ? `?${qs}` : ""}`;
}

function groupByCreator(
  recipes: (Recipes & { creators: Creators })[]
): Map<string, { creator: Creators; recipes: (Recipes & { creators: Creators })[] }> {
  const map = new Map<
    string,
    { creator: Creators; recipes: (Recipes & { creators: Creators })[] }
  >();
  for (const recipe of recipes) {
    const key = recipe.creators.link ?? String(recipe.creatorId);
    if (!map.has(key)) map.set(key, { creator: recipe.creators, recipes: [] });
    map.get(key)!.recipes.push(recipe);
  }
  return map;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RecipesPage({
  recipes,
  creators,
  filterOptions,
  activeFilters,
  activeView,
  totalCount,
}: Props) {
  const router = useRouter();
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const [importOpen, setImportOpen] = React.useState(false);

  const pageTitle = hasActiveFilters
    ? `${Object.values(activeFilters).join(" · ")} Recipes • Savry`
    : `${VIEW_LABELS[activeView]} • Savry`;

  const grouped = activeView === "by-creator" ? groupByCreator(recipes) : null;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Box
        component="main"
        sx={{
          maxWidth: "1080px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 5,
          pb: 12,
        }}
      >
        {/* ── Page header ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
                fontWeight: 400,
                color: "text.primary",
                lineHeight: 1.2,
                mb: 0.75,
              }}
            >
              Recipes
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "text.disabled" }}>
              {totalCount.toLocaleString()} recipes
              {hasActiveFilters && <> · filtered by {Object.values(activeFilters).join(", ")}</>}
            </Typography>
          </Box>

          <Button
            size="small"
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: "15px !important" }} />}
            sx={{ mb: 1 }}
            variant="outlined"
            onClick={() => setImportOpen(true)}
          >
            Import Recipe
          </Button>
        </Box>

        {/* ── View tabs ── */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            mb: 4,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {(Object.keys(VIEW_LABELS) as View[]).map((view) => {
            const active = activeView === view;
            return (
              <Box
                key={view}
                component={NextLink}
                href={buildHref(activeFilters, { view })}
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: active ? "text.primary" : "text.disabled",
                  textDecoration: "none",
                  px: 1.5,
                  py: 1.25,
                  borderBottom: active ? "2px solid #c8a96e" : "2px solid transparent",
                  mb: "-1px",
                  transition: "color 0.15s",
                  whiteSpace: "nowrap",
                  "&:hover": { color: "text.secondary" },
                }}
              >
                {VIEW_LABELS[view]}
              </Box>
            );
          })}
        </Box>

        {/* ── Creator strip (always visible) ── */}
        {creators.length > 0 && activeView !== "by-creator" && (
          <Box sx={{ mb: 5 }}>
            <SectionHeader
              href={buildHref(activeFilters, { view: "by-creator" })}
              label="Browse by creator"
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
                gap: 1.25,
              }}
            >
              {creators.slice(0, 10).map((creator) => (
                <Box
                  key={creator.link ?? creator.name}
                  component={NextLink}
                  href={creatorHref(creator.link ?? creator.name)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.75,
                    p: 1.25,
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    textDecoration: "none",
                    transition: "border-color 0.15s, background 0.15s",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.14)",
                      bgcolor: "#1a1a1a",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.07)",
                      bgcolor: "#1e1e1e",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {creator.image && (
                      <Image
                        fill
                        alt={creator.name}
                        sizes="44px"
                        src={creator.image}
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.625rem",
                      color: "text.secondary",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {creator.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── Filter chips ── */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3.5 }}>
          {FILTER_KEYS.map((key) => {
            const options = filterOptions[key];
            const activeValue = activeFilters[key];
            if (!options.length) return null;
            return (
              <Select
                key={key}
                displayEmpty
                renderValue={(val) =>
                  val ? (
                    <Box component="span" sx={{ color: "#c8a96e", fontSize: "0.75rem" }}>
                      {FILTER_LABELS[key]}: {val}
                    </Box>
                  ) : (
                    <Box component="span" sx={{ color: "text.disabled", fontSize: "0.75rem" }}>
                      {FILTER_LABELS[key]}
                    </Box>
                  )
                }
                size="small"
                sx={{
                  height: 30,
                  fontSize: "0.75rem",
                  borderRadius: "99px",
                  bgcolor: activeValue ? "rgba(200,169,110,0.1)" : "transparent",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: activeValue ? "rgba(200,169,110,0.35)" : "rgba(255,255,255,0.1)",
                    borderRadius: "99px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: activeValue ? "rgba(200,169,110,0.6)" : "rgba(255,255,255,0.2)",
                  },
                }}
                value={activeValue ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const next = { ...activeFilters };
                  if (val) next[key] = val;
                  else delete next[key];
                  router.push(buildHref(next, { view: activeView }));
                }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: "0.8125rem" }}>All {FILTER_LABELS[key].toLowerCase()}s</em>
                </MenuItem>
                {options.map((opt) => (
                  <MenuItem key={opt} sx={{ fontSize: "0.8125rem" }} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            );
          })}

          {hasActiveFilters && (
            <Chip
              label="Clear filters"
              size="small"
              sx={{
                height: 30,
                fontSize: "0.6875rem",
                borderRadius: "99px",
                color: "text.disabled",
                border: "1px solid rgba(255,255,255,0.1)",
                bgcolor: "transparent",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.04)",
                  color: "text.secondary",
                },
              }}
              onClick={() => router.push(buildHref({}, { view: activeView }))}
            />
          )}
        </Box>

        {/* ── Recipe grid — all / popular / highest / lowest ── */}
        {activeView !== "by-creator" && (
          <>
            <SectionHeader label={VIEW_LABELS[activeView]} />
            {recipes.length === 0 ? (
              <Typography sx={{ color: "text.disabled", fontSize: "0.875rem", mt: 4 }}>
                No recipes found for these filters.
              </Typography>
            ) : (
              <Grid container spacing={1.5}>
                {recipes.map((recipe, i) => (
                  <Grid key={`r-${i}`} size={{ xs: 6, sm: 4, md: 3 }}>
                    <RecipeCard
                      image={recipe.image}
                      link={recipeHref(recipe.creators.name, recipe.name)}
                      name={recipe.name}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* ── By-creator view ── */}
        {activeView === "by-creator" && grouped && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Array.from(grouped.entries()).map(([key, { creator, recipes: creatorRecipes }]) => (
              <Box key={key}>
                {/* Creator header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    pb: 1.5,
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.07)",
                      bgcolor: "#1e1e1e",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {creator.image && (
                      <Image
                        fill
                        alt={creator.name}
                        sizes="36px"
                        src={creator.image}
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    )}
                  </Box>
                  <Box>
                    <MuiLink
                      component={NextLink}
                      href={creatorHref(creator.link ?? creator.name)}
                      sx={{
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "text.primary",
                        "&:hover": { color: "primary.main" },
                        transition: "color 0.15s",
                      }}
                      underline="none"
                    >
                      {creator.name}
                    </MuiLink>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
                      {creatorRecipes.length} {creatorRecipes.length === 1 ? "recipe" : "recipes"}
                    </Typography>
                  </Box>
                </Box>

                {/* Recipe row — 5 visible + overflow */}
                <Grid container spacing={1.5}>
                  {creatorRecipes.slice(0, 5).map((recipe, i) => (
                    <Grid key={`cr-${i}`} size={{ xs: 6, sm: 4, md: 2.4 }}>
                      <RecipeCard
                        image={recipe.image}
                        link={recipeHref(recipe.creators.name, recipe.name)}
                        name={recipe.name}
                      />
                    </Grid>
                  ))}
                  {creatorRecipes.length > 5 && (
                    <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                      <Box
                        component={NextLink}
                        href={creatorHref(creator.link ?? creator.name)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          aspectRatio: "3/4",
                          borderRadius: "10px",
                          border: "1px dashed rgba(255,255,255,0.12)",
                          textDecoration: "none",
                          transition: "border-color 0.15s",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.22)",
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
                          +{creatorRecipes.length - 5} more
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <ImportRecipeModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={(id) => setImportOpen(false)}
      />
    </>
  );
}

// ── Data fetching ─────────────────────────────────────────────────────────────

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  const activeView = (
    ["all", "by-creator", "popular", "highest", "lowest"].includes(query.view as string)
      ? query.view
      : "all"
  ) as View;

  // Collect active filter params
  const activeFilters: Partial<Record<FilterKey, string>> = {};
  for (const key of FILTER_KEYS) {
    if (typeof query[key] === "string" && query[key]) {
      activeFilters[key] = query[key] as string;
    }
  }

  const hasFilters = Object.keys(activeFilters).length > 0;

  // Fetch recipes based on view + filters
  let recipes: (Recipes & { creators: Creators })[] = [];

  if (hasFilters) {
    // Apply first active filter via existing getFilteredRecipes,
    // then filter remaining keys in JS (avoids needing a new DB function)
    const [firstKey, firstVal] = Object.entries(activeFilters)[0];
    const base = await getFilteredRecipes(firstKey, firstVal as string);
    recipes = (base as (Recipes & { creators: Creators })[]).filter((r) =>
      Object.entries(activeFilters).every(([k, v]) => {
        const recipeVal = r[k as keyof Recipes];
        return recipeVal?.toString().toLowerCase() === v?.toLowerCase();
      })
    );
  } else if (activeView === "highest") {
    recipes = await getRecipesByRating("highest");
  } else if (activeView === "lowest") {
    recipes = await getRecipesByRating("lowest");
  } else {
    // all / by-creator / popular all start from the full list
    recipes = await getAllRecipes();
  }

  // Build filter option lists from full recipe set for the dropdowns
  const allRecipes: (Recipes & { creators: Creators })[] = await getAllRecipes();
  const filterOptions = Object.fromEntries(
    FILTER_KEYS.map((key) => [
      key,
      [
        ...new Set(allRecipes.map((r) => r[key as keyof Recipes]?.toString()).filter(Boolean)),
      ].sort(),
    ])
  ) as Record<FilterKey, string[]>;

  const creators = await getAllCreators();

  return {
    props: superjson.serialize({
      recipes,
      creators,
      filterOptions,
      activeFilters,
      activeView,
      totalCount: allRecipes.length,
    }).json,
  };
}
