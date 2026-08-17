# Production Ready Checklist

## Current production workflow

1. Configure production environment variables in Vercel.
2. Generate Prisma Client with `npm run db:generate`.
3. Run `npm run typecheck` and `npm run build` before deployment.
4. Apply reviewed Prisma migrations with `prisma migrate deploy`.
5. Keep `server/prisma/seed.ts` as the source of truth for additive catalog seed data.
6. Use Supabase Storage for persistent uploads.
7. Verify `/health`, authentication, specialties, operation catalog, operations, and authorization after deployment.

## Safety rules

- Never commit secrets.
- Never reset, truncate, or drop production tables.
- Do not use Vercel local storage for persistent files.
- Do not use production `prisma db push` as a substitute for migrations.
- Do not invent or replace the existing Specialty/Operation Catalog seed data.
