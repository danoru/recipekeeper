/**
 * Tidies an ingredient line for display without changing its meaning.
 * Recipe plugins often emit notes as ", (diced)" or "((large))" and some sites
 * append prices like "($0.04)".
 */
export function displayIngredient(raw: string): string {
  return raw
    .replace(/\s*\(\s*\$\d+(?:\.\d+)?\s*\)/g, "") // "($0.04)"
    .replace(/\(\(([^()]*)\)\)/g, "($1)") // "((large))" → "(large)"
    .replace(/,\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*$/, ", $1") // ", (diced (any color))" → ", diced (any color)"
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}
