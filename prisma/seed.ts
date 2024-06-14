import { PrismaClient } from "@prisma/client";
import { RECIPE_LIST } from "../src/data/recipes";
import { CREATOR_LIST } from "../src/data/creators";

const prisma = new PrismaClient();

async function main() {
  await prisma.creators.createMany({
    data: CREATOR_LIST,
    skipDuplicates: true,
  });
  await prisma.recipes.createMany({ data: RECIPE_LIST, skipDuplicates: true });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
