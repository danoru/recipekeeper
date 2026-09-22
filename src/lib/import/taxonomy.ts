// Savry's recipe classification vocabulary, shared by the importer's
// heuristics and the import form's dropdowns.

export const CATEGORY_OPTIONS = [
  "Beef",
  "Chicken",
  "Noodles",
  "Pasta",
  "Pork",
  "Rice & Grains",
  "Seafood",
  "Soup",
  "Vegetables",
  "Other",
];
export const CUISINE_OPTIONS = [
  "African",
  "Asian",
  "Caribbean",
  "Central American",
  "European",
  "Middle Eastern",
  "North American",
  "Oceanic",
  "South American",
];
export const COURSE_OPTIONS = ["Appetizers", "Breakfast", "Desserts", "Mains", "Sides"];
export const METHOD_OPTIONS = [
  "Classic",
  "Air Fryer",
  "One Pan",
  "One Pot",
  "Pressure Cooker",
  "Slow Cooker",
];
export const DIET_OPTIONS = ["None", "Dairy Free", "Gluten Free", "Paleo", "Vegan", "Vegetarian"];

type Rule = [RegExp, string];

function firstMatch(text: string, rules: Rule[]): string | null {
  for (const [pattern, value] of rules) if (pattern.test(text)) return value;
  return null;
}

const COURSE_RULES: Rule[] = [
  [/\b(dessert|cake|cookie|pie|sweet|baking|brownie|pudding)s?\b/i, "Desserts"],
  [/\bbreakfast|brunch\b/i, "Breakfast"],
  [/\b(appetizer|starter|snack|dip)s?\b/i, "Appetizers"],
  [/\bside( dish)?s?\b/i, "Sides"],
  [/\b(main|dinner|lunch|entree|entrée)/i, "Mains"],
];

/** Course from schema.org `recipeCategory` (and the name as a fallback). */
export function guessCourse(recipeCategory: string, name: string): string {
  return firstMatch(recipeCategory, COURSE_RULES) ?? firstMatch(name, COURSE_RULES) ?? "Mains";
}

const CUISINE_RULES: Rule[] = [
  [
    /\b(asian|chinese|japanese|korean|thai|vietnamese|filipino|taiwanese|indian|indonesian|malaysian|singaporean|burmese|cantonese|sichuan|szechuan|pakistani|nepali|sri lankan)\b/i,
    "Asian",
  ],
  [
    /\b(mexican|guatemalan|salvadoran|honduran|costa rican|central american)\b/i,
    "Central American",
  ],
  [
    /\b(peruvian|brazilian|argentin\w*|colombian|venezuelan|chilean|south american)\b/i,
    "South American",
  ],
  [/\b(caribbean|jamaican|cuban|puerto rican|dominican|haitian|trinidad\w*)\b/i, "Caribbean"],
  [
    /\b(middle eastern|lebanese|turkish|persian|iranian|israeli|syrian|egyptian|mediterranean)\b/i,
    "Middle Eastern",
  ],
  [/\b(african|moroccan|ethiopian|nigerian|ghanaian|senegalese|south african)\b/i, "African"],
  [
    /\b(european|italian|french|spanish|greek|german|british|english|irish|scottish|polish|portuguese|swedish|scandinavian|hungarian|russian|ukrainian)\b/i,
    "European",
  ],
  [/\b(australian|new zealand|hawaiian|oceanic|polynesian)\b/i, "Oceanic"],
  [
    /\b(american|southern|tex-mex|cajun|creole|canadian|soul food|southwestern)\b/i,
    "North American",
  ],
];

/** Region bucket from schema.org `recipeCuisine` (e.g. "Japanese" → "Asian"). */
export function guessCuisine(recipeCuisine: string): string | null {
  return firstMatch(recipeCuisine, CUISINE_RULES);
}

const CATEGORY_RULES: Rule[] = [
  [/\b(soup|stew|chowder|broth|bisque|pho|ramen|chili)\b/i, "Soup"],
  [
    /\b(pasta|spaghetti|lasagna|penne|rigatoni|fettuccine|linguine|mac(aroni)?|orzo|gnocchi|ravioli)\b/i,
    "Pasta",
  ],
  [/\b(noodles?|udon|soba|lo mein|pad thai|chow mein)\b/i, "Noodles"],
  [/\b(chicken|poultry)\b/i, "Chicken"],
  [/\b(beef|steak|brisket|burger|meatballs?)\b/i, "Beef"],
  [/\b(pork|bacon|ham|carnitas|sausage)\b/i, "Pork"],
  [/\b(shrimp|salmon|fish|cod|tuna|crab|lobster|scallops?|seafood|prawns?)\b/i, "Seafood"],
  [/\b(rice|risotto|quinoa|grain|farro|barley|congee)\b/i, "Rice & Grains"],
  [
    /\b(salad|vegetable|veggie|tofu|cauliflower|broccoli|mushroom|eggplant|squash)\b/i,
    "Vegetables",
  ],
];

/** Dish category from the recipe name, then schema.org keywords. */
export function guessCategory(name: string, extra = ""): string {
  return firstMatch(name, CATEGORY_RULES) ?? firstMatch(extra, CATEGORY_RULES) ?? "Other";
}

const METHOD_RULES: Rule[] = [
  [/\bair[- ]?fr(y|ied|yer)\b/i, "Air Fryer"],
  [/\b(instant pot|pressure cook\w*)\b/i, "Pressure Cooker"],
  [/\b(slow cook\w*|crock[- ]?pot)\b/i, "Slow Cooker"],
  [/\b(one[- ]pot|dutch oven)\b/i, "One Pot"],
  [/\b(one[- ]pan|sheet[- ]pan|skillet)\b/i, "One Pan"],
];

export function guessMethod(text: string): string {
  return firstMatch(text, METHOD_RULES) ?? "Classic";
}

const DIET_RULES: Rule[] = [
  [/vegan/i, "Vegan"],
  [/vegetarian/i, "Vegetarian"],
  [/gluten[- ]?free/i, "Gluten Free"],
  [/dairy[- ]?free|lactose/i, "Dairy Free"],
  [/paleo/i, "Paleo"],
];

/** From schema.org `suitableForDiet` (e.g. "https://schema.org/VeganDiet"). */
export function guessDiet(suitableForDiet: string): string {
  return firstMatch(suitableForDiet, DIET_RULES) ?? "None";
}
