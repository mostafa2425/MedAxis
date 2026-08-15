-- Additive ownership, nurses, procedures, and operation team members.
-- Preserves existing IDs and rows. No data loss.

-- 1) Hospital ownership
ALTER TABLE "hospitals" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
CREATE INDEX IF NOT EXISTS "hospitals_createdBy_idx" ON "hospitals"("createdBy");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hospitals_createdBy_fkey'
  ) THEN
    ALTER TABLE "hospitals"
      ADD CONSTRAINT "hospitals_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

UPDATE "hospitals" h
SET "createdBy" = sub."createdBy"
FROM (
  SELECT DISTINCT ON ("hospitalId") "hospitalId", "createdBy"
  FROM "operations"
  ORDER BY "hospitalId", "createdAt" ASC
) sub
WHERE h.id = sub."hospitalId" AND h."createdBy" IS NULL;

-- 2) Doctor ownership
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
CREATE INDEX IF NOT EXISTS "doctors_createdBy_idx" ON "doctors"("createdBy");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'doctors_createdBy_fkey'
  ) THEN
    ALTER TABLE "doctors"
      ADD CONSTRAINT "doctors_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

UPDATE "doctors"
SET "createdBy" = "userId"
WHERE "userId" IS NOT NULL AND "createdBy" IS NULL;

UPDATE "doctors" d
SET "createdBy" = sub.uid
FROM (
  SELECT DISTINCT ON (doc_id) doc_id, uid
  FROM (
    SELECT t."primarySurgeonId" AS doc_id, o."createdBy" AS uid, o."createdAt"
    FROM "operation_medical_team" t
    JOIN "operations" o ON o.id = t."operationId"
    WHERE t."primarySurgeonId" IS NOT NULL
    UNION ALL
    SELECT t."assistantSurgeonId", o."createdBy", o."createdAt"
    FROM "operation_medical_team" t
    JOIN "operations" o ON o.id = t."operationId"
    WHERE t."assistantSurgeonId" IS NOT NULL
    UNION ALL
    SELECT t."anesthesiologistId", o."createdBy", o."createdAt"
    FROM "operation_medical_team" t
    JOIN "operations" o ON o.id = t."operationId"
    WHERE t."anesthesiologistId" IS NOT NULL
    UNION ALL
    SELECT t."assistantAnesthesiaId", o."createdBy", o."createdAt"
    FROM "operation_medical_team" t
    JOIN "operations" o ON o.id = t."operationId"
    WHERE t."assistantAnesthesiaId" IS NOT NULL
  ) x
  ORDER BY doc_id, "createdAt" ASC
) sub
WHERE d.id = sub.doc_id AND d."createdBy" IS NULL;

-- 3) Nurses
CREATE TABLE IF NOT EXISTS "nurses" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "nurses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "nurses_createdBy_idx" ON "nurses"("createdBy");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'nurses_createdBy_fkey'
  ) THEN
    ALTER TABLE "nurses"
      ADD CONSTRAINT "nurses_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

INSERT INTO "nurses" ("id", "name", "phone", "email", "isActive", "createdBy", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, src.nurse_name, NULL, NULL, TRUE, src.uid, NOW(), NOW()
FROM (
  SELECT DISTINCT ON (o."createdBy", lower(trim(t.nurse)))
    trim(t.nurse) AS nurse_name,
    o."createdBy" AS uid
  FROM "operation_medical_team" t
  JOIN "operations" o ON o.id = t."operationId"
  WHERE t.nurse IS NOT NULL AND trim(t.nurse) <> ''
  ORDER BY o."createdBy", lower(trim(t.nurse))
) src
WHERE NOT EXISTS (
  SELECT 1 FROM "nurses" n
  WHERE n."createdBy" = src.uid AND lower(n.name) = lower(src.nurse_name)
);

-- 4) Operation procedures
CREATE TABLE IF NOT EXISTS "operation_procedures" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "catalogId" TEXT,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "specialtyId" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_procedures_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "operation_procedures_operationId_idx" ON "operation_procedures"("operationId");
CREATE INDEX IF NOT EXISTS "operation_procedures_catalogId_idx" ON "operation_procedures"("catalogId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_procedures_operationId_fkey'
  ) THEN
    ALTER TABLE "operation_procedures"
      ADD CONSTRAINT "operation_procedures_operationId_fkey"
      FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_procedures_catalogId_fkey'
  ) THEN
    ALTER TABLE "operation_procedures"
      ADD CONSTRAINT "operation_procedures_catalogId_fkey"
      FOREIGN KEY ("catalogId") REFERENCES "operation_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_procedures_specialtyId_fkey'
  ) THEN
    ALTER TABLE "operation_procedures"
      ADD CONSTRAINT "operation_procedures_specialtyId_fkey"
      FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

INSERT INTO "operation_procedures" ("id", "operationId", "catalogId", "name", "nameAr", "specialtyId", "sortOrder", "createdAt")
SELECT gen_random_uuid()::text, o.id, o."catalogId", o.name, NULL, o."specialtyId", 0, NOW()
FROM "operations" o
WHERE NOT EXISTS (
  SELECT 1 FROM "operation_procedures" p WHERE p."operationId" = o.id
);

-- 5) Operation team members
CREATE TABLE IF NOT EXISTS "operation_team_members" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "doctorId" TEXT,
  "nurseId" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_team_members_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "operation_team_members_operationId_idx" ON "operation_team_members"("operationId");
CREATE INDEX IF NOT EXISTS "operation_team_members_doctorId_idx" ON "operation_team_members"("doctorId");
CREATE INDEX IF NOT EXISTS "operation_team_members_nurseId_idx" ON "operation_team_members"("nurseId");

CREATE UNIQUE INDEX IF NOT EXISTS "operation_team_members_op_doctor_uidx"
  ON "operation_team_members"("operationId", "doctorId")
  WHERE "doctorId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "operation_team_members_op_nurse_uidx"
  ON "operation_team_members"("operationId", "nurseId")
  WHERE "nurseId" IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_team_members_operationId_fkey'
  ) THEN
    ALTER TABLE "operation_team_members"
      ADD CONSTRAINT "operation_team_members_operationId_fkey"
      FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_team_members_doctorId_fkey'
  ) THEN
    ALTER TABLE "operation_team_members"
      ADD CONSTRAINT "operation_team_members_doctorId_fkey"
      FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_team_members_nurseId_fkey'
  ) THEN
    ALTER TABLE "operation_team_members"
      ADD CONSTRAINT "operation_team_members_nurseId_fkey"
      FOREIGN KEY ("nurseId") REFERENCES "nurses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

INSERT INTO "operation_team_members" ("id", "operationId", "doctorId", "nurseId", "sortOrder", "createdAt")
SELECT gen_random_uuid()::text, src."operationId", src."doctorId", NULL, src.sort_order, NOW()
FROM (
  SELECT t."operationId", t."primarySurgeonId" AS "doctorId", 0 AS sort_order
  FROM "operation_medical_team" t
  WHERE t."primarySurgeonId" IS NOT NULL
  UNION ALL
  SELECT t."operationId", t."assistantSurgeonId", 1
  FROM "operation_medical_team" t
  WHERE t."assistantSurgeonId" IS NOT NULL
  UNION ALL
  SELECT t."operationId", t."anesthesiologistId", 2
  FROM "operation_medical_team" t
  WHERE t."anesthesiologistId" IS NOT NULL
  UNION ALL
  SELECT t."operationId", t."assistantAnesthesiaId", 3
  FROM "operation_medical_team" t
  WHERE t."assistantAnesthesiaId" IS NOT NULL
) src
WHERE NOT EXISTS (
  SELECT 1 FROM "operation_team_members" m
  WHERE m."operationId" = src."operationId" AND m."doctorId" = src."doctorId"
);

INSERT INTO "operation_team_members" ("id", "operationId", "doctorId", "nurseId", "sortOrder", "createdAt")
SELECT gen_random_uuid()::text, t."operationId", NULL, n.id, 10, NOW()
FROM "operation_medical_team" t
JOIN "operations" o ON o.id = t."operationId"
JOIN "nurses" n ON n."createdBy" = o."createdBy" AND lower(n.name) = lower(trim(t.nurse))
WHERE t.nurse IS NOT NULL AND trim(t.nurse) <> ''
AND NOT EXISTS (
  SELECT 1 FROM "operation_team_members" m
  WHERE m."operationId" = t."operationId" AND m."nurseId" = n.id
);
