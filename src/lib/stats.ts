// Pure statistics over diary data. Days are keyed in UTC ("YYYY-MM-DD") and
// "today" is always passed in, so server and client renders agree.

export interface CookEvent {
  date: string | Date;
}

export interface RatedEntry {
  recipeId: number;
  rating: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function dayKey(date: string | Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

function addDays(key: string, days: number): string {
  return new Date(Date.parse(key) + days * DAY_MS).toISOString().slice(0, 10);
}

/** Number of entries per UTC day. */
export function dailyCounts(events: CookEvent[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const e of events) {
    const key = dayKey(e.date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** Longest run of consecutive days with at least one entry. */
export function longestStreak(events: CookEvent[]): number {
  const days = [...dailyCounts(events).keys()].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of days) {
    run = prev && addDays(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/**
 * Consecutive days ending today — or yesterday, so a streak isn't "broken"
 * just because you haven't cooked yet today.
 */
export function currentStreak(events: CookEvent[], today: string | Date): number {
  const days = new Set(dailyCounts(events).keys());
  let cursor = dayKey(today);
  if (!days.has(cursor)) cursor = addDays(cursor, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface HeatmapCell {
  date: string;
  count: number;
}

/**
 * `weeks` columns of 7 days (Sunday first), ending with the week containing
 * `today`. Days after `today` are omitted from the final week.
 */
export function heatmapWeeks(
  counts: Map<string, number>,
  today: string | Date,
  weeks = 52
): HeatmapCell[][] {
  const end = dayKey(today);
  const endDow = new Date(end).getUTCDay();
  const start = addDays(end, -endDow - (weeks - 1) * 7);

  const result: HeatmapCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: HeatmapCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d);
      if (date > end) break;
      week.push({ date, count: counts.get(date) ?? 0 });
    }
    result.push(week);
  }
  return result;
}

/** Most frequent keys, ties broken alphabetically. Falsy keys are skipped. */
export function topBy<T>(
  items: T[],
  keyFn: (item: T) => string | null | undefined,
  limit = 5
): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, limit);
}

/** Month (0–11, UTC) with the most entries; earliest month wins ties. */
export function busiestMonth(events: CookEvent[]): { month: number; count: number } | null {
  if (events.length === 0) return null;
  const counts = new Array<number>(12).fill(0);
  for (const e of events) counts[new Date(e.date).getUTCMonth()]++;
  const count = Math.max(...counts);
  return { month: counts.indexOf(count), count };
}

function averageByRecipe(entries: RatedEntry[]): Map<number, number> {
  const sums = new Map<number, { total: number; n: number }>();
  for (const { recipeId, rating } of entries) {
    const s = sums.get(recipeId) ?? { total: 0, n: 0 };
    s.total += rating;
    s.n++;
    sums.set(recipeId, s);
  }
  return new Map([...sums].map(([id, s]) => [id, s.total / s.n]));
}

/**
 * Share of recipes both users rated where their average ratings are within
 * one star. Null when fewer than `minShared` recipes overlap.
 */
export function ratingAgreement(
  a: RatedEntry[],
  b: RatedEntry[],
  minShared = 3
): { shared: number; agreement: number } | null {
  const avgA = averageByRecipe(a);
  const avgB = averageByRecipe(b);
  let shared = 0;
  let agree = 0;
  for (const [recipeId, ratingA] of avgA) {
    const ratingB = avgB.get(recipeId);
    if (ratingB === undefined) continue;
    shared++;
    if (Math.abs(ratingA - ratingB) <= 1) agree++;
  }
  return shared >= minShared ? { shared, agreement: agree / shared } : null;
}

export interface CookingActivity {
  weeks: HeatmapCell[][];
  currentStreak: number;
  longestStreak: number;
  totalLastYear: number;
}

/** Everything the profile heatmap needs, computed once on the server. */
export function cookingActivity(
  events: CookEvent[],
  today: string | Date,
  weeks = 52
): CookingActivity {
  const grid = heatmapWeeks(dailyCounts(events), today, weeks);
  return {
    weeks: grid,
    currentStreak: currentStreak(events, today),
    longestStreak: longestStreak(events),
    totalLastYear: grid.flat().reduce((sum, cell) => sum + cell.count, 0),
  };
}
