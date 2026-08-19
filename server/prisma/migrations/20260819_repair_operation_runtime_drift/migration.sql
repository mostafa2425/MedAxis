-- Repair legacy operation columns left behind by the pre-Prisma runtime schema.
-- Keep legacy columns for backwards compatibility, but remove stale NOT NULL
-- requirements that are incompatible with the current Prisma schema and services.

ALTER TABLE public.operations
  ALTER COLUMN "doctorId" DROP NOT NULL;

ALTER TABLE public.operation_team_members
  ALTER COLUMN "medicalTeamId" DROP NOT NULL;
