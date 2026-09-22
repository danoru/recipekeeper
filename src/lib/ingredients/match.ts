// Rule-based matching of parsed ingredient names to the canonical dictionary.

export interface DictionaryEntry {
  id?: number;
  name: string;
  aliases: string[];
}

// Words where stripping a trailing "s" would be wrong.
const KEEP_S = new Set([
  "asparagus",
  "couscous",
  "hummus",
  "molasses",
  "swiss",
  "brussels",
  "citrus",
  "lettuce",
  "hibiscus",
  "grits",
  "oats",
  "chives",
]);
const IRREGULAR: Record<string, string> = { leaves: "leaf", loaves: "loaf", halves: "half" };
// Singulars ending in "ie", which the "-ies → -y" rule would mangle.
const IE_WORDS = new Set(["veggie", "cookie", "brownie", "smoothie", "pie", "hoagie", "sweetie"]);

export function singularize(word: string): string {
  if (IRREGULAR[word]) return IRREGULAR[word];
  if (word.endsWith("ies") && IE_WORDS.has(word.slice(0, -1))) return word.slice(0, -1);
  if (KEEP_S.has(word) || word.length <= 3) return word;
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("oes")) return word.slice(0, -2);
  if (/(?:ss|ch|sh|x|z)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s") && !/(?:ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

/** Lowercase, strip accents and punctuation, singularize each word. */
export function normalizeName(name: string): string[] {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(singularize);
}

export class IngredientMatcher<E extends DictionaryEntry = DictionaryEntry> {
  private readonly phrases = new Map<string, E>();
  private readonly maxWords: number;

  constructor(entries: E[]) {
    let maxWords = 1;
    for (const entry of entries) {
      for (const phrase of [entry.name, ...entry.aliases]) {
        const words = normalizeName(phrase);
        const key = words.join(" ");
        // First definition wins, so canonical names beat later aliases.
        if (key && !this.phrases.has(key)) this.phrases.set(key, entry);
        maxWords = Math.max(maxWords, words.length);
      }
    }
    this.maxWords = maxWords;
  }

  /**
   * The dictionary entry for the longest word run in `name` that matches a
   * known phrase ("chicken stock" beats "chicken"). Leftmost wins among runs
   * of equal length ("salt and pepper" → salt).
   */
  match(name: string | null | undefined): E | null {
    if (!name) return null;
    const words = normalizeName(name);
    for (let len = Math.min(this.maxWords, words.length); len > 0; len--) {
      for (let start = 0; start + len <= words.length; start++) {
        const hit = this.phrases.get(words.slice(start, start + len).join(" "));
        if (hit) return hit;
      }
    }
    return null;
  }
}
