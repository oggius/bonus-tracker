# bonus-tracker
Track additional activity, earn bonuses and convert them into benefits

Implementation plan: see [TASKS.md](./TASKS.md) for the commit-by-commit execution checklist.

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
pnpm turbo run build
pnpm --filter @bonus-tracker/web dev
```

## Deployment (Vercel)

1. Import this repository into Vercel.
2. Set the required environment variables for Preview and Production:
	- `DATABASE_URL`
	- `SESSION_SECRET`
	- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`
3. Trigger a Preview deployment.
4. Verify production build locally if needed:

```bash
pnpm turbo run build
```
