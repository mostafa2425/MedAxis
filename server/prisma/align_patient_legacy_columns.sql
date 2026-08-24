-- The Patient Prisma model now uses fullName.
-- Keep legacy firstName/lastName columns for backward compatibility,
-- but they must not block creation of patients through the current API.
ALTER TABLE public.patients
  ALTER COLUMN "firstName" DROP NOT NULL,
  ALTER COLUMN "lastName" DROP NOT NULL;
