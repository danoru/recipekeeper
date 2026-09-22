/**
 * Fills in ingredients/steps for catalog recipes by re-reading their source
 * pages' JSON-LD. Only touches ingredients, steps, yield, time, and the
 * canonical URL — never names, images, or categories you've curated.
 *
 *   pnpm backfill:ingredients              # recipes with no ingredients yet
 *   pnpm backfill:ingredients --dry-run    # report only, write nothing
 *   pnpm backfill:ingredients --all        # re-parse every recipe
 *   pnpm backfill:ingredients --limit=10
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const limit = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1]) || undefined;
const DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // Imported after env is loaded so the client picks up the connection string.
  const { default: prisma } = await import("../src/data/db");
  const { replaceRecipeContent } = await import("../src/data/imports");
  const { extractPageData, parseRecipe } = await import("../src/lib/import/jsonld");
  const { parseHttpUrl } = await import("../src/lib/import/url");

  const recipes = await prisma.recipes.findMany({
    where: all ? {} : { ingredients: { none: {} } },
    select: { id: true, name: true, link: true },
    orderBy: { id: "asc" },
    take: limit,
  });
  console.log(`${recipes.length} recipe(s) to process${dryRun ? " (dry run)" : ""}.\n`);

  const results = { updated: 0, noData: 0, failed: 0 };

  for (const [i, recipe] of recipes.entries()) {
    const label = `[${i + 1}/${recipes.length}] #${recipe.id} ${recipe.name}`;
    const url = parseHttpUrl(recipe.link)?.toString();
    if (!url) {
      console.log(`${label}: skipped (no http link)`);
      results.noData++;
      continue;
    }

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RecipeImporter/1.0; +https://savry.app)",
        },
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const parsed = parseRecipe(extractPageData(await res.text(), url));
      if (!parsed || parsed.ingredients.length === 0) {
        console.log(`${label}: no ingredient data on page`);
        results.noData++;
      } else {
        if (!dryRun) await replaceRecipeContent(recipe.id, parsed);
        console.log(
          `${label}: ${parsed.ingredients.length} ingredients, ${parsed.steps.length} steps`
        );
        results.updated++;
      }
    } catch (err) {
      console.log(`${label}: failed (${err instanceof Error ? err.message : err})`);
      results.failed++;
    }

    if (i < recipes.length - 1) await sleep(DELAY_MS);
  }

  console.log(
    `\nDone. ${dryRun ? "Would update" : "Updated"} ${results.updated}, no data ${results.noData}, failed ${results.failed}.`
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
