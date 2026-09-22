import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  // Imported after env is loaded so the client picks up the connection string.
  const { default: prisma } = await import("../src/data/db");
  const { CREATOR_LIST, RECIPE_LIST } = await import("./seed-data");

  try {
    await prisma.creators.createMany({ data: CREATOR_LIST, skipDuplicates: true });
    await prisma.recipes.createMany({ data: RECIPE_LIST, skipDuplicates: true });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
