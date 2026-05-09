# bonus-tracker
Track additional activity, earn bonuses and convert them into benefits

Implementation plan: see [TASKS.md](./TASKS.md) for the commit-by-commit execution checklist.

## Runtime Source Of Truth

- `apps/web` is the only runtime web application.
- `packages/ui` contains shared UI components and styles used by `apps/web`.
- `packages/db` contains Prisma schema, migrations, and seed scripts.
- `_figma_design` is kept as historical design/prototype reference only and is not part of runtime or deployment.

## Environment Variables

Create a root `.env` file (or configure Vercel project environment variables) with:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `SESSION_SECRET`: secret key used to sign session JWT cookies.
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`: stable Next.js Server Actions encryption key.

Notes:

- For local development, use your local Postgres URL.
- For Vercel preview/production, use your managed PostgreSQL URL (for example, Neon).
- `SESSION_SECRET` must be set in production.

## Local Development

```bash
pnpm install
cp .env.example .env
pnpm --filter @bonus-tracker/db db:migrate
pnpm --filter @bonus-tracker/db db:seed
pnpm turbo run build
pnpm --filter @bonus-tracker/web dev
```

## Deployment (Vercel)

1. Import this repository into Vercel.
2. Set the required environment variables for Preview and Production:
	- `DATABASE_URL`
	- `SESSION_SECRET`
	- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`
3. Set Build Command override:
	- `pnpm --filter @bonus-tracker/db prisma migrate deploy && pnpm turbo run build`
4. Trigger a Preview deployment.
5. (One-time) seed production data manually when bootstrapping a new database:
	- `DATABASE_URL="<prod_db_url>" pnpm --filter @bonus-tracker/db db:seed`
6. Verify production build locally if needed:

```bash
pnpm turbo run build
```
