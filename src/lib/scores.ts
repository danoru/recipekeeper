// How Savry scores things, from diary ratings (null = logged without a rating):
//   • A user's score for a recipe = the average of their ratings of it.
//   • A recipe's score = the average of its users' scores, so someone who
//     cooked it ten times still counts once.
//   • A creator's score = the average of their recipes' scores.

export interface RatedLog {
  userId: number;
  recipeId: number;
  rating: number | null;
}

export interface Score {
  /** Average, or null when nothing has been rated. */
  score: number | null;
  /** How many ratings (or raters / rated recipes) the average is based on. */
  count: number;
}

export function average(values: number[]): number | null {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
}

/** recipeId → (userId → that user's average rating of the recipe). */
export function userRecipeScores(logs: RatedLog[]): Map<number, Map<number, number>> {
  const sums = new Map<number, Map<number, { total: number; n: number }>>();
  for (const { userId, recipeId, rating } of logs) {
    if (rating === null) continue;
    const byUser = sums.get(recipeId) ?? new Map();
    const s = byUser.get(userId) ?? { total: 0, n: 0 };
    s.total += rating;
    s.n++;
    byUser.set(userId, s);
    sums.set(recipeId, byUser);
  }
  return new Map(
    [...sums].map(([recipeId, byUser]) => [
      recipeId,
      new Map([...byUser].map(([userId, s]) => [userId, s.total / s.n])),
    ])
  );
}

/** recipeId → the recipe's score (count = number of people who rated it). */
export function recipeScores(logs: RatedLog[]): Map<number, Score> {
  return new Map(
    [...userRecipeScores(logs)].map(([recipeId, byUser]) => [
      recipeId,
      { score: average([...byUser.values()]), count: byUser.size },
    ])
  );
}

/** Average of the given recipes' scores (count = number of rated recipes). */
export function creatorScore(scores: Iterable<Score>): Score {
  const rated = [...scores].flatMap((s) => (s.score === null ? [] : [s.score]));
  return { score: average(rated), count: rated.length };
}

/** Counts per half-star bucket (0.5–5), rounding each score to the nearest half. */
export function halfStarHistogram(scores: number[]): { rating: number; count: number }[] {
  const buckets = new Map<number, number>();
  for (let r = 0.5; r <= 5; r += 0.5) buckets.set(r, 0);
  for (const score of scores) {
    const rounded = Math.min(5, Math.max(0.5, Math.round(score * 2) / 2));
    buckets.set(rounded, (buckets.get(rounded) ?? 0) + 1);
  }
  return [...buckets].map(([rating, count]) => ({ rating, count }));
}
