-- This migration reconciles the operation/team foreign keys on databases
-- that may already contain some or all of the constraints.

-- Drop existing constraints when present.
ALTER TABLE "operation_medical_team" DROP CONSTRAINT IF EXISTS "operation_medical_team_anesthesiologistId_fkey";
ALTER TABLE "operation_medical_team" DROP CONSTRAINT IF EXISTS "operation_medical_team_assistantAnesthesiaId_fkey";
ALTER TABLE "operation_medical_team" DROP CONSTRAINT IF EXISTS "operation_medical_team_assistantSurgeonId_fkey";
ALTER TABLE "operation_medical_team" DROP CONSTRAINT IF EXISTS "operation_medical_team_primarySurgeonId_fkey";
ALTER TABLE "operations" DROP CONSTRAINT IF EXISTS "operations_specialtyId_fkey";
ALTER TABLE "patients" DROP CONSTRAINT IF EXISTS "patients_createdBy_fkey";

-- Recreate the expected constraints only when they are not already present.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operations_specialtyId_fkey'
  ) THEN
    ALTER TABLE "operations"
      ADD CONSTRAINT "operations_specialtyId_fkey"
      FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_medical_team_primarySurgeonId_fkey'
  ) THEN
    ALTER TABLE "operation_medical_team"
      ADD CONSTRAINT "operation_medical_team_primarySurgeonId_fkey"
      FOREIGN KEY ("primarySurgeonId") REFERENCES "doctors"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_medical_team_assistantSurgeonId_fkey'
  ) THEN
    ALTER TABLE "operation_medical_team"
      ADD CONSTRAINT "operation_medical_team_assistantSurgeonId_fkey"
      FOREIGN KEY ("assistantSurgeonId") REFERENCES "doctors"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_medical_team_anesthesiologistId_fkey'
  ) THEN
    ALTER TABLE "operation_medical_team"
      ADD CONSTRAINT "operation_medical_team_anesthesiologistId_fkey"
      FOREIGN KEY ("anesthesiologistId") REFERENCES "doctors"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_medical_team_assistantAnesthesiaId_fkey'
  ) THEN
    ALTER TABLE "operation_medical_team"
      ADD CONSTRAINT "operation_medical_team_assistantAnesthesiaId_fkey"
      FOREIGN KEY ("assistantAnesthesiaId") REFERENCES "doctors"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
