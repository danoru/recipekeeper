import { describe, expect, it } from "vitest";

import { INGREDIENTS } from "../../../prisma/ingredients-data";

import { IngredientMatcher, singularize } from "./match";
import { parseIngredientLine } from "./parse";
import { buildIngredientRows } from "./rows";

const matcher = new IngredientMatcher(INGREDIENTS);
const match = (name: string) => matcher.match(name)?.name ?? null;

describe("singularize", () => {
  it.each([
    ["tomatoes", "tomato"],
    ["cherries", "cherry"],
    ["veggies", "veggie"],
    ["cookies", "cookie"],
    ["pies", "pie"],
    ["peaches", "peach"],
    ["onions", "onion"],
    ["leaves", "leaf"],
    ["asparagus", "asparagus"],
    ["molasses", "molasses"],
    ["glass", "glass"],
  ])("%s → %s", (word, expected) => {
    expect(singularize(word)).toBe(expected);
  });
});

describe("dictionary", () => {
  it("has no duplicate canonical names", () => {
    const names = INGREDIENTS.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("IngredientMatcher", () => {
  it.each([
    ["red bell peppers", "bell pepper"],
    ["garlic", "garlic"],
    ["kosher salt", "salt"],
    ["Salt and pepper", "salt"],
    ["freshly ground black pepper", "black pepper"],
    ["boneless skinless chicken thighs", "chicken thigh"],
    ["chicken stock", "chicken stock"],
    ["low-sodium chicken broth", "chicken stock"],
    ["peanut butter", "peanut butter"],
    ["unsalted butter", "butter"],
    ["extra-virgin olive oil", "olive oil"],
    ["scallions", "green onion"],
    ["yellow onion", "onion"],
    ["red onion", "red onion"],
    ["jalapeño", "jalapeño"],
    ["jalapeno peppers", "jalapeño"],
    ["canned chickpeas", "chickpea"],
    ["spaghetti", "pasta"],
    ["ground cumin", "cumin"],
    ["ground beef", "ground beef"],
    ["fresh cilantro", "cilantro"],
    ["Parmigiano Reggiano", "parmesan"],
    ["large eggs", "egg"],
    ["bay leaves", "bay leaf"],
    ["heavy whipping cream", "heavy cream"],
    ["stir fry veggies", "frozen mixed vegetable"],
    ["broth", "stock"],
    ["chicken broth", "chicken stock"],
  ])("%s → %s", (name, expected) => {
    expect(match(name)).toBe(expected);
  });

  it("returns null for unknown or empty names", () => {
    expect(match("dragon fruit syrup")).toBeNull();
    expect(match("")).toBeNull();
    expect(matcher.match(null)).toBeNull();
  });

  it("works end to end with the parser", () => {
    const parsed = parseIngredientLine("2 (15-ounce) cans chickpeas, drained and rinsed");
    expect(match(parsed.name!)).toBe("chickpea");
  });
});

describe("buildIngredientRows", () => {
  const withIds = new IngredientMatcher(INGREDIENTS.map((entry, id) => ({ ...entry, id })));

  it("parses lines, carries section headers, and links dictionary ids", () => {
    const rows = buildIngredientRows(
      ["For the sauce:", "2 tbsp soy sauce", "1 tsp honey", "Garnish:", "sliced scallions", "  "],
      withIds
    );
    expect(rows.map((r) => [r.position, r.section, r.name])).toEqual([
      [0, "sauce", "soy sauce"],
      [1, "sauce", "honey"],
      [2, "Garnish", "sliced scallions"],
    ]);
    const scallion = INGREDIENTS.findIndex((i) => i.name === "green onion");
    expect(rows[2].ingredientId).toBe(scallion);
  });

  it("leaves ingredientId null when there's no matcher or no match", () => {
    expect(buildIngredientRows(["1 cup flour"], null)[0].ingredientId).toBeNull();
    expect(buildIngredientRows(["1 dragon fruit"], withIds)[0].ingredientId).toBeNull();
  });
});
