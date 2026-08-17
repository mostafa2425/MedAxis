-- Sprint 0/1: Egyptian governorates and operation cost breakdown.
-- Safe for existing data: new columns are nullable/defaulted; existing operation cost rows receive zero values.

CREATE TABLE IF NOT EXISTS "governorates" (
  "id" TEXT NOT NULL,
  "nameEn" TEXT NOT NULL,
  "nameAr" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "governorates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "governorates_nameEn_key" ON "governorates"("nameEn");
CREATE UNIQUE INDEX IF NOT EXISTS "governorates_nameAr_key" ON "governorates"("nameAr");
CREATE UNIQUE INDEX IF NOT EXISTS "governorates_code_key" ON "governorates"("code");

ALTER TABLE "hospitals" ADD COLUMN IF NOT EXISTS "nameAr" TEXT;
ALTER TABLE "hospitals" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "hospitals" ADD COLUMN IF NOT EXISTS "governorateId" TEXT;
ALTER TABLE "hospitals" ADD COLUMN IF NOT EXISTS "notes" TEXT;

CREATE INDEX IF NOT EXISTS "hospitals_governorateId_idx" ON "hospitals"("governorateId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hospitals_governorateId_fkey'
  ) THEN
    ALTER TABLE "hospitals"
      ADD CONSTRAINT "hospitals_governorateId_fkey"
      FOREIGN KEY ("governorateId") REFERENCES "governorates"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "operation_costs" ADD COLUMN IF NOT EXISTS "hospitalCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "operation_costs" ADD COLUMN IF NOT EXISTS "nursingCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "operation_costs" ADD COLUMN IF NOT EXISTS "assistantDoctorsCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "operation_costs" ADD COLUMN IF NOT EXISTS "equipmentCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "operation_costs" ADD COLUMN IF NOT EXISTS "otherCost" DECIMAL(10,2) NOT NULL DEFAULT 0;
