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
pnpm exec prisma db push   # sync the schema to the database
pnpm exec prisma db seed   # load creators and recipes from prisma/seed-data.ts
```

## Scripts

- `pnpm check`: lint, format check, and typecheck
- `pnpm lint:fix` / `pnpm format`: auto-fix
- `pnpm build` / `pnpm start`: production build and server
