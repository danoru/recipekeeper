import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer loads env files itself. `vercel env pull` writes .env.local.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrate/introspection use the direct (non-pooled) connection.
  // Left optional so `prisma generate` works without database credentials.
  datasource: {
    url: process.env.POSTGRES_URL_NON_POOLING,
  },
});
