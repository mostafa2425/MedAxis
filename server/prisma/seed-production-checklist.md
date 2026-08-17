# Production Seed Checklist

- Use `server/prisma/seed.ts` as the source of truth.
- Review the expected records before running a production seed.
- Confirm the seed uses upsert/idempotent behavior.
- Never reset, truncate, or delete production catalog data to reseed.
- Keep custom operation records intact.
- Verify Specialty -> Area of Expertise -> Operation Catalog relationships after seeding.

Production credentials are supplied through environment variables and must never be stored in this repository.
