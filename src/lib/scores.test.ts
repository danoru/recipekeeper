import { describe, expect, it } from "vitest";

import {
  average,
  creatorScore,
  halfStarHistogram,
  recipeScores,
  userRecipeScores,
  type RatedLog,
} from "./scores";

const log = (userId: number, recipeId: number, rating: number | null): RatedLog => ({
  userId,
  recipeId,
  rating,
});

describe("average", () => {
  it("returns null for no values", () => {
    expect(average([])).toBeNull();
    expect(average([4, 5])).toBe(4.5);
  });
});

describe("userRecipeScores", () => {
  it("averages each user's ratings of a recipe and skips N/A", () => {
    const scores = userRecipeScores([log(1, 10, 5), log(1, 10, 4), log(1, 10, null)]);
    expect(scores.get(10)?.get(1)).toBe(4.5);
  });
});

describe("recipeScores", () => {
  it("averages users' scores so frequent cooks count once", () => {
    // User 1 cooked it three times (all 5s); user 2 once (a 3).
    const scores = recipeScores([log(1, 10, 5), log(1, 10, 5), log(1, 10, 5), log(2, 10, 3)]);
    expect(scores.get(10)).toEqual({ score: 4, count: 2 });
  });

  it("leaves recipes with only N/A ratings unscored", () => {
    expect(recipeScores([log(1, 10, null)]).get(10)).toBeUndefined();
  });
});

describe("creatorScore", () => {
  it("averages recipe scores and ignores unrated recipes", () => {
    expect(
      creatorScore([
        { score: 5, count: 1 },
        { score: 3, count: 4 },
        { score: null, count: 0 },
      ])
    ).toEqual({ score: 4, count: 2 });
    expect(creatorScore([])).toEqual({ score: null, count: 0 });
  });
});

describe("halfStarHistogram", () => {
  it("rounds scores to the nearest half star", () => {
    const hist = halfStarHistogram([4.3, 4.6, 5, 0.1]);
    const count = (r: number) => hist.find((b) => b.rating === r)?.count;
    expect(hist).toHaveLength(10);
    expect(count(4.5)).toBe(2);
    expect(count(5)).toBe(1);
    expect(count(0.5)).toBe(1);
  });
});
