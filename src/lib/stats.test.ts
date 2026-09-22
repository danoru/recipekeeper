import { describe, expect, it } from "vitest";

import {
  busiestMonth,
  cookingActivity,
  currentStreak,
  dailyCounts,
  dayKey,
  heatmapWeeks,
  longestStreak,
  ratingAgreement,
  topBy,
} from "./stats";

const on = (...dates: string[]) => dates.map((date) => ({ date: `${date}T12:00:00Z` }));

describe("dayKey / dailyCounts", () => {
  it("keys by UTC day and counts duplicates", () => {
    expect(dayKey("2026-03-01T23:30:00Z")).toBe("2026-03-01");
    const counts = dailyCounts(on("2026-03-01", "2026-03-01", "2026-03-02"));
    expect(counts.get("2026-03-01")).toBe(2);
    expect(counts.get("2026-03-02")).toBe(1);
  });
});

describe("longestStreak", () => {
  it("is 0 with no entries", () => {
    expect(longestStreak([])).toBe(0);
  });

  it("counts consecutive days, ignoring same-day duplicates", () => {
    expect(longestStreak(on("2026-01-01", "2026-01-02", "2026-01-02", "2026-01-03"))).toBe(3);
  });

  it("spans month and year boundaries", () => {
    expect(longestStreak(on("2025-12-30", "2025-12-31", "2026-01-01", "2026-01-02"))).toBe(4);
    expect(longestStreak(on("2026-02-27", "2026-02-28", "2026-03-01"))).toBe(3);
  });

  it("picks the longest of several runs regardless of input order", () => {
    expect(
      longestStreak(on("2026-05-10", "2026-05-01", "2026-05-02", "2026-05-11", "2026-05-12"))
    ).toBe(3);
  });
});

describe("currentStreak", () => {
  const events = on("2026-06-08", "2026-06-09", "2026-06-10");

  it("includes today", () => {
    expect(currentStreak(events, "2026-06-10T20:00:00Z")).toBe(3);
  });

  it("stays alive through yesterday", () => {
    expect(currentStreak(events, "2026-06-11T09:00:00Z")).toBe(3);
  });

  it("breaks after a missed day", () => {
    expect(currentStreak(events, "2026-06-12T09:00:00Z")).toBe(0);
  });
});

describe("heatmapWeeks", () => {
  it("returns Sunday-first weeks ending on today", () => {
    // 2026-09-22 is a Tuesday
    const weeks = heatmapWeeks(dailyCounts(on("2026-09-20", "2026-09-22")), "2026-09-22", 2);
    expect(weeks).toHaveLength(2);
    expect(weeks[0][0].date).toBe("2026-09-13"); // Sunday
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[1].map((c) => c.date)).toEqual(["2026-09-20", "2026-09-21", "2026-09-22"]);
    expect(weeks[1].map((c) => c.count)).toEqual([1, 0, 1]);
  });
});

describe("topBy", () => {
  it("sorts by count, then key, and skips empty keys", () => {
    const items = ["b", "a", "b", "c", "a", "b", "", null];
    expect(topBy(items, (x) => x, 2)).toEqual([
      { key: "b", count: 3 },
      { key: "a", count: 2 },
    ]);
  });
});

describe("busiestMonth", () => {
  it("returns null without entries", () => {
    expect(busiestMonth([])).toBeNull();
  });

  it("finds the month with the most entries, earliest on ties", () => {
    expect(busiestMonth(on("2026-03-01", "2026-03-05", "2026-07-01"))).toEqual({
      month: 2,
      count: 2,
    });
    expect(busiestMonth(on("2026-07-01", "2026-02-01"))).toEqual({ month: 1, count: 1 });
  });
});

describe("ratingAgreement", () => {
  const a = [
    { recipeId: 1, rating: 5 },
    { recipeId: 2, rating: 2 },
    { recipeId: 3, rating: 4 },
    { recipeId: 4, rating: 3 },
  ];

  it("is null with no overlap or fewer than the minimum shared recipes", () => {
    expect(ratingAgreement(a, [{ recipeId: 9, rating: 5 }])).toBeNull();
    expect(
      ratingAgreement(a, [
        { recipeId: 1, rating: 5 },
        { recipeId: 2, rating: 2 },
      ])
    ).toBeNull();
  });

  it("counts recipes within one star as agreement, averaging repeat ratings", () => {
    const b = [
      { recipeId: 1, rating: 4.5 }, // agree
      { recipeId: 2, rating: 5 }, // disagree (3 apart)
      { recipeId: 3, rating: 2 }, // averages to 3 with the next → agree
      { recipeId: 3, rating: 4 },
    ];
    const result = ratingAgreement(a, b);
    expect(result).toEqual({ shared: 3, agreement: 2 / 3 });
  });
});

describe("cookingActivity", () => {
  it("combines heatmap totals and streaks", () => {
    const activity = cookingActivity(
      on("2025-01-01", "2026-09-20", "2026-09-21", "2026-09-21"),
      "2026-09-22",
      4
    );
    expect(activity.weeks).toHaveLength(4);
    expect(activity.totalLastYear).toBe(3); // the 2025 entry is outside the window
    expect(activity.currentStreak).toBe(2);
    expect(activity.longestStreak).toBe(2);
  });
});
