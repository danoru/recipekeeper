import { describe, expect, it } from "vitest";

import {
  cleanText,
  decodeEntities,
  extractPageData,
  extractSteps,
  parseDuration,
  parseRecipe,
} from "./jsonld";

// Synthetic pages that mirror the JSON-LD structures real recipe sites emit.

const page = (jsonLd: unknown, head = "") =>
  `<html><head>${head}<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body></body></html>`;

// WordPress Recipe Maker / Yoast style: everything inside @graph.
const WPRM = page(
  {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "Little Kitchen" },
      { "@type": "Article", headline: "Weeknight Pasta" },
      {
        "@type": "Recipe",
        name: "Garlic Butter Shrimp Pasta",
        description: "Quick &amp; easy &#8211; ready in 20 minutes.",
        author: { "@type": "Person", name: "Jane Cook", url: "https://littlekitchen.com/about" },
        image: ["https://littlekitchen.com/img/1x1.jpg", "https://littlekitchen.com/img/4x3.jpg"],
        recipeYield: ["4", "4 servings"],
        prepTime: "PT10M",
        cookTime: "PT15M",
        totalTime: "PT25M",
        recipeCategory: ["Dinner", "Main Course"],
        recipeCuisine: ["Italian"],
        keywords: "shrimp, pasta, one pan",
        recipeIngredient: [
          "8 oz linguine",
          "1 lb shrimp, peeled",
          "4 tbsp butter",
          "4 cloves garlic, minced",
        ],
        recipeInstructions: [
          { "@type": "HowToStep", text: "Boil the pasta." },
          { "@type": "HowToStep", text: "Sear the shrimp in butter &amp; garlic." },
        ],
      },
    ],
  },
  '<meta property="og:site_name" content="Little Kitchen" />'
);

// HowToSection groups and a top-level array.
const SECTIONED = page([
  { "@type": "Organization", name: "Big Food Site" },
  {
    "@type": ["Recipe", "NewsArticle"],
    name: "Pork Belly Ramen",
    recipeCuisine: "Japanese",
    recipeCategory: "Soup",
    recipeIngredient: ["2 lb pork belly", "8 cups chicken broth", "4 portions ramen noodles"],
    recipeInstructions: [
      {
        "@type": "HowToSection",
        name: "For the pork",
        itemListElement: [
          { "@type": "HowToStep", text: "Roll and tie the pork belly." },
          { "@type": "HowToStep", text: "Braise for 3 hours." },
        ],
      },
      {
        "@type": "HowToSection",
        name: "To serve",
        itemListElement: [{ "@type": "HowToStep", text: "Assemble bowls." }],
      },
    ],
    totalTime: "P0DT3H30M",
    suitableForDiet: "https://schema.org/GlutenFreeDiet",
  },
]);

// Minimal/odd: recipe under mainEntity, instructions as one HTML string,
// author as a plain string, image as an ImageObject.
const MINIMAL = page(
  {
    "@type": "WebPage",
    mainEntity: {
      "@type": "Recipe",
      name: "Slow Cooker Chili",
      author: "Sam",
      image: { "@type": "ImageObject", url: "https://example.org/chili.jpg" },
      recipeIngredient: "1 lb ground beef\n1 onion, diced",
      recipeInstructions: "<p>Brown the beef.</p><p>Add everything to the slow cooker.</p>",
    },
  },
  '<meta content="https://example.org/og.jpg" property="og:image" />'
);

describe("parseRecipe", () => {
  it("parses a WPRM-style @graph page", () => {
    const r = parseRecipe(extractPageData(WPRM, "https://littlekitchen.com/garlic-shrimp/"))!;
    expect(r.name).toBe("Garlic Butter Shrimp Pasta");
    expect(r.description).toBe("Quick & easy – ready in 20 minutes.");
    expect(r.image).toBe("https://littlekitchen.com/img/1x1.jpg");
    expect(r.recipeYield).toBe("4");
    expect(r.totalTimeMinutes).toBe(25);
    expect(r.course).toBe("Mains");
    expect(r.cuisine).toBe("European");
    expect(r.category).toBe("Pasta");
    expect(r.method).toBe("One Pan");
    expect(r.ingredients).toHaveLength(4);
    expect(r.steps).toEqual([
      { section: null, text: "Boil the pasta." },
      { section: null, text: "Sear the shrimp in butter & garlic." },
    ]);
    expect(r.creatorName).toBe("Jane Cook");
    expect(r.creatorLink).toBe("littlekitchen");
  });

  it("flattens HowToSection groups and handles a top-level array", () => {
    const r = parseRecipe(extractPageData(SECTIONED, "https://bigfood.com/ramen"))!;
    expect(r.name).toBe("Pork Belly Ramen");
    expect(r.cuisine).toBe("Asian");
    expect(r.category).toBe("Soup");
    expect(r.diet).toBe("Gluten Free");
    expect(r.totalTimeMinutes).toBe(210);
    expect(r.steps).toEqual([
      { section: "For the pork", text: "Roll and tie the pork belly." },
      { section: "For the pork", text: "Braise for 3 hours." },
      { section: "To serve", text: "Assemble bowls." },
    ]);
  });

  it("handles mainEntity, string instructions, and sparse fields", () => {
    const r = parseRecipe(extractPageData(MINIMAL, "https://example.org/chili"))!;
    expect(r.name).toBe("Slow Cooker Chili");
    expect(r.image).toBe("https://example.org/chili.jpg");
    expect(r.ingredients).toEqual(["1 lb ground beef", "1 onion, diced"]);
    expect(r.steps.map((s) => s.text)).toEqual([
      "Brown the beef.",
      "Add everything to the slow cooker.",
    ]);
    expect(r.method).toBe("Slow Cooker");
    expect(r.creatorName).toBe("Sam");
    expect(r.cuisine).toBe("Unknown");
    expect(r.totalTimeMinutes).toBeNull();
  });

  it("falls back to og:image and prep+cook time", () => {
    const html = page(
      {
        "@type": "Recipe",
        name: "Toast",
        prepTime: "PT5M",
        cookTime: "PT3M",
      },
      '<meta property="og:image" content="https://t.co/toast.png" />'
    );
    const r = parseRecipe(extractPageData(html, "https://t.co/toast"))!;
    expect(r.image).toBe("https://t.co/toast.png");
    expect(r.totalTimeMinutes).toBe(8);
  });

  it("resolves an author referenced by @id (Yoast graphs)", () => {
    const html = page({
      "@graph": [
        { "@type": "Recipe", name: "Gyudon", author: { "@id": "https://site.com/#/person/1" } },
        { "@type": "Person", "@id": "https://site.com/#/person/1", name: "Nami" },
      ],
    });
    expect(parseRecipe(extractPageData(html, "https://site.com/gyudon"))!.creatorName).toBe("Nami");
  });

  it("never uses an unresolved @id as the creator name", () => {
    const html = page(
      { "@type": "Recipe", name: "Gyudon", author: { "@id": "https://site.com/#/person/404" } },
      '<meta property="og:site_name" content="Just One Site" />'
    );
    expect(parseRecipe(extractPageData(html, "https://site.com/gyudon"))!.creatorName).toBe(
      "Just One Site"
    );
  });

  it("skips malformed blocks and returns null without a Recipe", () => {
    const html =
      '<script type="application/ld+json">{not json</script>' +
      page({ "@type": "Article", headline: "No recipe here" });
    expect(parseRecipe(extractPageData(html, "https://x.com/a"))).toBeNull();
  });
});

describe("helpers", () => {
  it("parses ISO-8601 durations", () => {
    expect(parseDuration("PT1H30M")).toBe(90);
    expect(parseDuration("PT45M")).toBe(45);
    expect(parseDuration("P1DT2H")).toBe(1560);
    expect(parseDuration("PT0M")).toBeNull();
    expect(parseDuration("45 minutes")).toBeNull();
  });

  it("decodes entities and strips tags", () => {
    expect(decodeEntities("Mom&#8217;s &amp; Dad&rsquo;s &#x27;best&#x27;")).toBe(
      "Mom’s & Dad’s 'best'"
    );
    expect(cleanText("<b>Stir</b>   well&nbsp;now")).toBe("Stir well now");
  });

  it("ignores empty steps", () => {
    expect(extractSteps([{ "@type": "HowToStep", text: "  " }, ""])).toEqual([]);
  });
});
