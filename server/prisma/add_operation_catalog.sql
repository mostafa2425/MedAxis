-- Additive schema for doctor user link + operation catalog.
-- Safe for existing data: new nullable columns and a new table only.

ALTER TABLE "doctors"
  ADD COLUMN IF NOT EXISTS "userId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "doctors_userId_key" ON "doctors"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'doctors_userId_fkey'
  ) THEN
    ALTER TABLE "doctors"
      ADD CONSTRAINT "doctors_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "operation_catalog" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "specialtyId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "isCustom" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_catalog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "operation_catalog_specialtyId_idx" ON "operation_catalog"("specialtyId");
CREATE INDEX IF NOT EXISTS "operation_catalog_createdBy_idx" ON "operation_catalog"("createdBy");
CREATE INDEX IF NOT EXISTS "operation_catalog_name_specialtyId_idx" ON "operation_catalog"("name", "specialtyId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_catalog_specialtyId_fkey'
  ) THEN
    ALTER TABLE "operation_catalog"
      ADD CONSTRAINT "operation_catalog_specialtyId_fkey"
      FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_catalog_createdBy_fkey'
  ) THEN
    ALTER TABLE "operation_catalog"
      ADD CONSTRAINT "operation_catalog_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "operations"
  ADD COLUMN IF NOT EXISTS "catalogId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operations_catalogId_fkey'
  ) THEN
    ALTER TABLE "operations"
      ADD CONSTRAINT "operations_catalogId_fkey"
      FOREIGN KEY ("catalogId") REFERENCES "operation_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
