-- Keep the development database aligned with the Prisma auth/doctor models.
-- Safe to re-run on environments that already contain these columns.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true;

ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "createdBy" uuid;

UPDATE public.doctors
SET name = trim(concat_ws(' ', "firstName", "lastName"))
WHERE coalesce(name, '') = '';

UPDATE public.doctors
SET "createdBy" = "userId"
WHERE "createdBy" IS NULL AND "userId" IS NOT NULL;
