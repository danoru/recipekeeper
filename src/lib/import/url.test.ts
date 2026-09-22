import { describe, expect, it } from "vitest";

import { canonicalizeUrl, parseHttpUrl } from "./url";

describe("canonicalizeUrl", () => {
  it.each([
    [
      "https://www.Example.com/recipes/lasagna/?utm_source=pinterest&utm_medium=social",
      "https://example.com/recipes/lasagna",
    ],
    ["http://example.com/recipes/lasagna", "https://example.com/recipes/lasagna"],
    ["https://example.com/recipes/lasagna#recipe", "https://example.com/recipes/lasagna"],
    ["https://example.com/r?id=5&fbclid=abc", "https://example.com/r?id=5"],
    ["https://example.com/r?b=2&a=1", "https://example.com/r?a=1&b=2"],
    ["https://example.com/", "https://example.com"],
  ])("%s → %s", (input, expected) => {
    expect(canonicalizeUrl(input)).toBe(expected);
  });

  it("treats tracking variants of one page as the same", () => {
    const a = canonicalizeUrl("https://site.com/pasta/?utm_campaign=x");
    const b = canonicalizeUrl("https://www.site.com/pasta#jump-to-recipe");
    expect(a).toBe(b);
  });

  it("rejects non-http URLs", () => {
    expect(canonicalizeUrl("javascript:alert(1)")).toBeNull();
    expect(canonicalizeUrl("ftp://example.com/file")).toBeNull();
    expect(canonicalizeUrl("not a url")).toBeNull();
    expect(parseHttpUrl(42)).toBeNull();
  });
});
