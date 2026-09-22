# Savry

Track the recipes you cook, rate them, and follow what your friends are making. Built with Next.js
(pages router), MUI, next-auth, and Prisma on Postgres.

## Setup

Requires Node 20.9+ and pnpm.

```bash
pnpm install          # also runs `prisma generate` into src/generated/prisma
vercel env pull       # or create .env.local by hand (see below)
pnpm dev
```

Environment variables (read from `.env.local`, then `.env`):

| Variable                   | Used for                                         |
| -------------------------- | ------------------------------------------------ |
| `POSTGRES_PRISMA_URL`      | App runtime connection (pooled)                  |
| `POSTGRES_URL_NON_POOLING` | Prisma CLI: `db push`, migrations, seed (direct) |
| `NEXTAUTH_SECRET`          | Signing session tokens                           |
| `NEXTAUTH_URL`             | Site URL (needed outside Vercel)                 |

## Database

The schema lives in `prisma/schema.prisma`; CLI settings are in `prisma.config.ts`.

```bash
pnpm exec prisma migrate deploy   # apply migrations in prisma/migrations
pnpm exec prisma db seed          # creators, recipes, and the ingredient dictionary (safe to re-run)
pnpm backfill:ingredients         # fill in ingredients for recipes from their source pages
```

Schema changes: edit `schema.prisma`, then `pnpm exec prisma migrate dev --name <change>`.

The ingredient dictionary is in `prisma/ingredients-data.ts`. Admins can see which ingredient names
don't match it yet at `/admin/ingredients`; add them as names or aliases, re-seed, then run
`pnpm backfill:ingredients --all`.

## Scripts

- `pnpm check`: lint, format check, typecheck, and tests
- `pnpm test` / `pnpm test:watch`: unit tests (Vitest)
- `pnpm lint:fix` / `pnpm format`: auto-fix
- `pnpm build` / `pnpm start`: production build and server
