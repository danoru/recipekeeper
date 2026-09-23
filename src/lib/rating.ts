/**
 * Validates a diary rating from a request body. Blank (null, undefined, "")
 * means "N/A"; otherwise it must be 0.5–5 in half-star steps.
 */
export function parseOptionalRating(
  value: unknown
): { ok: true; rating: number | null } | { ok: false } {
  if (value === null || value === undefined || value === "") return { ok: true, rating: null };
  const rating = Number(value);
  const valid = rating >= 0.5 && rating <= 5 && Number.isInteger(rating * 2);
  return valid ? { ok: true, rating } : { ok: false };
}
