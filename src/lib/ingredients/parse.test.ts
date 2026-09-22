import { describe, expect, it } from "vitest";

import { parseIngredientLine } from "./parse";

type Expected = {
  quantity?: number | null;
  quantityMax?: number | null;
  unit?: string | null;
  name: string | null;
  note?: string | null;
};

// [input, expected] — fields left out of `expected` aren't asserted.
const CASES: [string, Expected][] = [
  // quantities, fractions, ranges
  ["2 cups flour", { quantity: 2, unit: "cup", name: "flour", note: null }],
  ["2 1/2 cups sugar", { quantity: 2.5, unit: "cup", name: "sugar" }],
  ["½ tsp kosher salt", { quantity: 0.5, unit: "teaspoon", name: "kosher salt" }],
  ["1 ½ cups milk", { quantity: 1.5, unit: "cup", name: "milk" }],
  ["¾ cup heavy cream", { quantity: 0.75, unit: "cup", name: "heavy cream" }],
  [
    "2–3 cloves garlic, minced",
    { quantity: 2, quantityMax: 3, unit: "clove", name: "garlic", note: "minced" },
  ],
  ["2-3 tablespoons water", { quantity: 2, quantityMax: 3, unit: "tablespoon", name: "water" }],
  ["1.5 lbs ground beef", { quantity: 1.5, unit: "pound", name: "ground beef" }],
  ["0.5 oz dried porcini", { quantity: 0.5, unit: "ounce", name: "dried porcini" }],
  // unit spellings
  ["1 1/2 Tbsp. olive oil", { quantity: 1.5, unit: "tablespoon", name: "olive oil" }],
  ["2 tablespoons soy sauce", { quantity: 2, unit: "tablespoon", name: "soy sauce" }],
  ["1 tsp ground cumin", { quantity: 1, unit: "teaspoon", name: "ground cumin" }],
  ["200g spaghetti", { quantity: 200, unit: "gram", name: "spaghetti" }],
  ["500 ml chicken stock", { quantity: 500, unit: "milliliter", name: "chicken stock" }],
  ["1 kg potatoes, peeled", { quantity: 1, unit: "kilogram", name: "potatoes", note: "peeled" }],
  [
    "1 lb boneless skinless chicken thighs",
    { quantity: 1, unit: "pound", name: "boneless skinless chicken thighs" },
  ],
  // no unit
  ["1 onion, finely chopped", { quantity: 1, unit: null, name: "onion", note: "finely chopped" }],
  ["2 carrots", { quantity: 2, unit: null, name: "carrots" }],
  ["4 green onions, thinly sliced", { quantity: 4, name: "green onions", note: "thinly sliced" }],
  // sizes are notes, not units
  ["3 large eggs", { quantity: 3, unit: null, name: "eggs", note: "large" }],
  [
    "1 medium yellow onion, diced",
    { quantity: 1, unit: null, name: "yellow onion", note: "medium, diced" },
  ],
  ["2 small shallots", { quantity: 2, unit: null, name: "shallots", note: "small" }],
  // parentheticals
  [
    "2 1/2 cups (300 g) red bell peppers, diced",
    { quantity: 2.5, unit: "cup", name: "red bell peppers", note: "300 g, diced" },
  ],
  ["1 (14 oz) can coconut milk", { quantity: 1, unit: "can", name: "coconut milk", note: "14 oz" }],
  [
    "2 (15-ounce) cans black beans, drained and rinsed",
    { quantity: 2, unit: "can", name: "black beans", note: "15-ounce, drained and rinsed" },
  ],
  ["1 cup flour (all-purpose)", { quantity: 1, unit: "cup", name: "flour", note: "all-purpose" }],
  // pinches, taste, optional
  ["a pinch of red pepper flakes", { quantity: 1, unit: "pinch", name: "red pepper flakes" }],
  ["pinch of salt", { quantity: 1, unit: "pinch", name: "salt" }],
  ["Salt and pepper, to taste", { quantity: null, name: "Salt and pepper", note: "to taste" }],
  ["salt to taste", { quantity: null, name: "salt", note: "to taste" }],
  ["fresh cilantro, for garnish", { name: "fresh cilantro", note: "for garnish" }],
  [
    "1 tbsp sesame seeds, optional",
    { quantity: 1, unit: "tablespoon", name: "sesame seeds", note: "optional" },
  ],
  // real-world lines from the seed catalog's sites
  [
    "10 oz boneless, skinless chicken thighs",
    { quantity: 10, unit: "ounce", name: "boneless, skinless chicken thighs", note: null },
  ],
  [
    "3 onions ((large; 2¼ lb, 1,005 g))",
    { quantity: 3, unit: null, name: "onions", note: "large; 2¼ lb, 1,005 g" },
  ],
  [
    "2 15oz. cans cannellini beans, drained and rinsed ($1.88)",
    { quantity: 2, unit: "can", name: "cannellini beans", note: "15oz, drained and rinsed" },
  ],
  [
    "1 Tbsp cooking oil ($0.04)",
    { quantity: 1, unit: "tablespoon", name: "cooking oil", note: null },
  ],
  [
    "shichimi togarashi (Japanese seven spice) ((optional))",
    { quantity: null, name: "shichimi togarashi", note: "Japanese seven spice, optional" },
  ],
  [
    "1 pound tomatillos, (husked and rinsed)",
    { quantity: 1, unit: "pound", name: "tomatillos", note: "husked and rinsed" },
  ],
  [
    "2 teaspoons kosher salt, (plus more as needed)",
    { quantity: 2, unit: "teaspoon", name: "kosher salt", note: "plus more as needed" },
  ],
  // no quantity
  ["Olive oil", { quantity: null, unit: null, name: "Olive oil", note: null }],
  ["Cooked rice, for serving", { quantity: null, name: "Cooked rice", note: "for serving" }],
];

describe("parseIngredientLine", () => {
  it.each(CASES)("%s", (input, expected) => {
    const result = parseIngredientLine(input);
    expect(result.isHeader).toBe(false);
    expect(result.raw).toBe(input);
    for (const [key, value] of Object.entries(expected)) {
      expect(result[key as keyof Expected], key).toEqual(value);
    }
  });

  it("recognizes section headers", () => {
    const result = parseIngredientLine("For the sauce:");
    expect(result.isHeader).toBe(true);
  });

  it("never throws on junk", () => {
    for (const junk of ["", "   ", "—", "1", "()", ",,,"]) {
      expect(() => parseIngredientLine(junk)).not.toThrow();
    }
  });
});
