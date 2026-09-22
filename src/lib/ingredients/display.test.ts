import { describe, expect, it } from "vitest";

import { displayIngredient } from "./display";

describe("displayIngredient", () => {
  it.each([
    ["2 large bell peppers, (diced (any color))", "2 large bell peppers, diced (any color)"],
    ["1 Anaheim pepper, (diced)", "1 Anaheim pepper, diced"],
    [
      "1 tablespoon ancho chili powder ((or regular chili powder))",
      "1 tablespoon ancho chili powder (or regular chili powder)",
    ],
    ["½ onion ((4 oz, 113 g))", "½ onion (4 oz, 113 g)"],
    ["1 Tbsp cooking oil ($0.04)", "1 Tbsp cooking oil"],
    [
      "2 15oz. cans cannellini beans, drained and rinsed ($1.88)",
      "2 15oz. cans cannellini beans, drained and rinsed",
    ],
    ["1 (15-ounce) can pinto beans", "1 (15-ounce) can pinto beans"],
    ["2 cups flour", "2 cups flour"],
  ])("%s", (input, expected) => {
    expect(displayIngredient(input)).toBe(expected);
  });
});
