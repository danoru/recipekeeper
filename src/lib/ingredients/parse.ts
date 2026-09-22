import { parseIngredient } from "parse-ingredient";

export interface ParsedIngredient {
  raw: string;
  quantity: number | null;
  quantityMax: number | null;
  /** Canonical unit id, e.g. "cup", "tablespoon", "gram", "can". */
  unit: string | null;
  /** The ingredient itself, e.g. "red bell peppers". */
  name: string | null;
  /** Prep/size details, e.g. "diced", "large", "300 g", "to taste". */
  note: string | null;
  /** Section headers like "For the sauce:". */
  isHeader: boolean;
}

// parse-ingredient treats these as units; for us they describe the item.
const SIZE_WORDS = new Set(["small", "medium", "large", "extra-large", "extra large", "jumbo"]);

// Container units that commonly follow a parenthetical size: "1 (14 oz) can".
const CONTAINERS = new Set([
  "can",
  "cans",
  "jar",
  "jars",
  "package",
  "packages",
  "pkg",
  "bag",
  "bags",
  "box",
  "boxes",
  "bottle",
  "bottles",
  "carton",
  "cartons",
  "block",
  "blocks",
  "stick",
  "sticks",
]);

const PINCH = /^(?:an?\s+)?(pinch|dash|handful|splash|sprinkle)(?:es|s)?\s+(?:of\s+)?/i;
const TO_TASTE = /,?\s*(?:or\s+)?(?:to taste|as needed|for serving|for garnish|optional)\s*$/i;

// "15oz. cans", "15-ounce can" — a package size written without parentheses.
const SIZED_CONTAINER =
  /^(\d+(?:\.\d+)?\s*-?\s*(?:oz|ounces?|g|grams?|ml|lbs?|pounds?)\.?)\s+(\w+)\s+/i;

// Words that can precede a comma without being the ingredient's name:
// "boneless, skinless chicken thighs" shouldn't become name="boneless".
const DESCRIPTORS = new Set([
  "boneless",
  "skinless",
  "bone-in",
  "skin-on",
  "fresh",
  "freshly",
  "large",
  "medium",
  "small",
  "ripe",
  "raw",
  "cooked",
  "lean",
  "extra",
  "firm",
  "soft",
  "hot",
  "cold",
  "warm",
  "peeled",
  "unpeeled",
  "seedless",
  "unsalted",
  "salted",
  "organic",
]);

// Budget Bytes-style cost annotations: "($0.04)".
const PRICE = /\(?\s*\$\d+(?:\.\d+)?\s*\)?/g;

/** Removes every (balanced, possibly nested) parenthetical, returning them as notes. */
function extractParentheticals(text: string): { rest: string; notes: string[] } {
  const notes: string[] = [];
  let rest = "";
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "(") {
      if (depth > 0) current += ch;
      depth++;
    } else if (ch === ")" && depth > 0) {
      depth--;
      if (depth === 0) {
        notes.push(current);
        current = "";
      } else current += ch;
    } else if (depth > 0) current += ch;
    else rest += ch;
  }
  if (current) rest += current; // unbalanced "(": keep the text
  const cleaned = notes.map((n) => n.replace(/^\(+|\)+$/g, "").trim()).filter(Boolean);
  return { rest: rest.replace(/\s+/g, " "), notes: cleaned };
}

/** Splits "name, prep" at the first comma that follows a real name word. */
function splitNameAndPrep(text: string): { name: string; prep: string | null } {
  let start = 0;
  while (true) {
    const comma = text.indexOf(",", start);
    if (comma === -1) return { name: text, prep: null };
    const words = text
      .slice(0, comma)
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);
    if (!words.every((w) => DESCRIPTORS.has(w))) {
      return { name: text.slice(0, comma), prep: text.slice(comma + 1) };
    }
    start = comma + 1;
  }
}

function clean(s: string | null | undefined): string | null {
  const trimmed = s
    ?.replace(/\s+/g, " ")
    .replace(/^[\s,;:-]+|[\s,;:-]+$/g, "")
    .trim();
  return trimmed ? trimmed : null;
}

function joinNotes(...notes: (string | null | undefined)[]): string | null {
  return clean(notes.filter(Boolean).join(", "));
}

export function parseIngredientLine(raw: string): ParsedIngredient {
  const line = raw.replace(/\s+/g, " ").trim();
  const [parsed] = parseIngredient(line);
  const base: ParsedIngredient = {
    raw,
    quantity: null,
    quantityMax: null,
    unit: null,
    name: null,
    note: null,
    isHeader: false,
  };
  if (!parsed) return base;
  if (parsed.isGroupHeader) return { ...base, isHeader: true, name: clean(parsed.description) };

  let quantity = parsed.quantity;
  let unit = parsed.unitOfMeasureID;
  const notes: string[] = [];

  // "3 large eggs": "large" is a size, not a unit.
  if (unit && SIZE_WORDS.has(unit.toLowerCase())) {
    notes.push(unit.toLowerCase());
    unit = null;
  }

  // Parentheticals anywhere are notes: "(14 oz) can …", "onions ((large; 2¼ lb))".
  const parens = extractParentheticals(parsed.description.replace(PRICE, " "));
  let description = parens.rest.trim();
  notes.push(...parens.notes);

  // A package unit: "(14 oz) can coconut milk" → can; "15oz. cans beans" → can.
  if (!unit) {
    const sized = description.match(SIZED_CONTAINER);
    if (sized && CONTAINERS.has(sized[2].toLowerCase())) {
      notes.unshift(sized[1].replace(/\.$/, ""));
      unit = sized[2].toLowerCase();
      description = description.slice(sized[0].length);
    } else {
      const container = description.match(/^(\w+)\s+/);
      if (parens.notes.length && container && CONTAINERS.has(container[1].toLowerCase())) {
        unit = container[1].toLowerCase();
        description = description.slice(container[0].length);
      }
    }
    if (unit) unit = unit.replace(/(?:es|s)$/, "");
  }

  // "a pinch of red pepper flakes" / "pinch of salt" — an implied quantity of 1.
  const pinch = description.match(PINCH);
  if (pinch && !unit) {
    unit = pinch[1].toLowerCase();
    description = description.slice(pinch[0].length);
  }
  if (unit && PINCH.test(`${unit} `)) quantity ??= 1;

  // "to taste", "for serving", ...
  const tail = description.match(TO_TASTE);
  if (tail) {
    notes.push(tail[0].replace(/^,?\s*(?:or\s+)?/, ""));
    description = description.slice(0, tail.index);
  }

  // After the name, a comma introduces prep: "onion, finely chopped".
  const { name, prep } = splitNameAndPrep(description);
  if (prep) notes.push(prep);

  return {
    ...base,
    quantity,
    quantityMax: parsed.quantity2,
    unit,
    name: clean(name.replace(/^of\s+/i, "")),
    note: joinNotes(...notes),
  };
}
