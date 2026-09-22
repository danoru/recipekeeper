import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  // Imported after env is loaded so the client picks up the connection string.
  const { default: prisma } = await import("../src/data/db");
  const { canonicalizeUrl } = await import("../src/lib/import/url");
  const { CREATOR_LIST, RECIPE_LIST } = await import("./seed-data");
  const { INGREDIENTS } = await import("./ingredients-data");

  try {
    await prisma.creators.createMany({ data: CREATOR_LIST, skipDuplicates: true });

    // Skip recipes already present (older rows may predate sourceUrlCanonical,
    // so match on the link too), making re-seeding safe.
    const existing = new Set(
      (await prisma.recipes.findMany({ select: { link: true } })).map((r) => r.link)
    );
    await prisma.recipes.createMany({
      data: RECIPE_LIST.filter((r) => !existing.has(r.link)).map((r) => ({
        ...r,
        sourceUrlCanonical: canonicalizeUrl(r.link),
      })),
      skipDuplicates: true,
    });

    // Upsert so edits to ingredients-data.ts (aliases, categories) apply on re-seed.
    for (const { name, aliases, category } of INGREDIENTS) {
      await prisma.ingredient.upsert({
        where: { name },
        update: { aliases, category },
        create: { name, aliases, category },
      });
    }
    console.log(`Seeded ${INGREDIENTS.length} dictionary ingredients.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
