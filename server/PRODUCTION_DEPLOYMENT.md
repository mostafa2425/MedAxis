# MedAxis Backend Production Deployment

## Database migration policy

Production schema changes must use Prisma migrations. Do not use `prisma db push` against the production database and never use destructive reset commands.

Before deploying a schema change:

1. Create and review the migration locally.
2. Run `npm run db:generate`.
3. Validate with `npm run typecheck` and the available test suite.
4. Apply reviewed migrations in production with `npm run db:migrate:deploy`.
5. Deploy the application to Vercel.

## Commands

```bash
npm run db:generate
npm run typecheck
npm run db:migrate:deploy
npm run build
```

`DATABASE_URL` must be provided by the deployment environment. Never commit `.env` files or database credentials.

## Seed policy

Production seed data is additive/idempotent and must be reviewed before execution. The current Specialty, Area of Expertise, and Operation Catalog source of truth is `server/prisma/seed.ts`.

Do not reset or truncate production data to run a seed.

## Vercel

The backend build runs Prisma Client generation before TypeScript compilation. Environment variables are configured in Vercel; secrets must never be hardcoded.

## Storage

Persistent uploaded files must use Supabase Storage. Vercel's local filesystem is not a persistent upload store.
