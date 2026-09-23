import { describe, expect, it } from "vitest";

import { parseOptionalRating } from "./rating";

describe("parseOptionalRating", () => {
  it("treats blank as N/A", () => {
    for (const blank of [null, undefined, ""]) {
      expect(parseOptionalRating(blank)).toEqual({ ok: true, rating: null });
    }
  });

  it("accepts half stars from 0.5 to 5", () => {
    expect(parseOptionalRating(4.5)).toEqual({ ok: true, rating: 4.5 });
    expect(parseOptionalRating("3")).toEqual({ ok: true, rating: 3 });
  });

  it("rejects anything else", () => {
    for (const bad of [0, 5.5, 4.3, -1, "abc", {}]) {
      expect(parseOptionalRating(bad)).toEqual({ ok: false });
    }
  });
});
