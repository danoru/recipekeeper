import type { DictionaryEntry, IngredientMatcher } from "./match";
import { parseIngredientLine } from "./parse";

export interface IngredientRow {
  position: number;
  section: string | null;
  raw: string;
  quantity: number | null;
  quantityMax: number | null;
  unit: string | null;
  name: string | null;
  note: string | null;
  ingredientId: number | null;
}

/**
 * Parses raw ingredient lines into rows. Section headers ("For the sauce:")
 * aren't stored as rows; they become the `section` of the lines below them.
 */
export function buildIngredientRows(
  lines: string[],
  matcher: IngredientMatcher<DictionaryEntry> | null
): IngredientRow[] {
  const rows: IngredientRow[] = [];
  let section: string | null = null;

  for (const raw of lines) {
    const parsed = parseIngredientLine(raw);
    if (parsed.isHeader) {
      section = parsed.name?.replace(/:$/, "").replace(/^for the\s+/i, "") ?? null;
      continue;
    }
    if (!parsed.name && parsed.quantity === null) continue; // blank/junk line

    rows.push({
      position: rows.length,
      section,
      raw: raw.trim(),
      quantity: parsed.quantity,
      quantityMax: parsed.quantityMax,
      unit: parsed.unit,
      name: parsed.name,
      note: parsed.note,
      ingredientId: matcher?.match(parsed.name)?.id ?? null,
    });
  }
  return rows;
}
