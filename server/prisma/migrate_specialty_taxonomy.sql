-- Additive taxonomy migration: specialty hierarchy, doctor subspecialties,
-- catalog subspecialty link. Preserves existing IDs and rows.

-- 1) Schema
ALTER TABLE "specialties"
  ADD COLUMN IF NOT EXISTS "parentId" TEXT;

CREATE INDEX IF NOT EXISTS "specialties_parentId_idx" ON "specialties"("parentId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'specialties_parentId_fkey'
  ) THEN
    ALTER TABLE "specialties"
      ADD CONSTRAINT "specialties_parentId_fkey"
      FOREIGN KEY ("parentId") REFERENCES "specialties"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "doctor_subspecialties" (
  "id" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "doctor_subspecialties_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "doctor_subspecialties_doctorId_specialtyId_key"
  ON "doctor_subspecialties"("doctorId", "specialtyId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'doctor_subspecialties_doctorId_fkey'
  ) THEN
    ALTER TABLE "doctor_subspecialties"
      ADD CONSTRAINT "doctor_subspecialties_doctorId_fkey"
      FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'doctor_subspecialties_specialtyId_fkey'
  ) THEN
    ALTER TABLE "doctor_subspecialties"
      ADD CONSTRAINT "doctor_subspecialties_specialtyId_fkey"
      FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "operation_catalog"
  ADD COLUMN IF NOT EXISTS "subspecialtyId" TEXT;

CREATE INDEX IF NOT EXISTS "operation_catalog_subspecialtyId_idx"
  ON "operation_catalog"("subspecialtyId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'operation_catalog_subspecialtyId_fkey'
  ) THEN
    ALTER TABLE "operation_catalog"
      ADD CONSTRAINT "operation_catalog_subspecialtyId_fkey"
      FOREIGN KEY ("subspecialtyId") REFERENCES "specialties"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 2) Top-level specialties (preserve existing IDs if already present)
INSERT INTO "specialties" ("id", "name", "nameAr", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Orthopedics', 'جراحة العظام', TRUE, NOW(), NOW()),
  (gen_random_uuid()::text, 'Dermatology', 'الأمراض الجلدية', TRUE, NOW(), NOW()),
  (gen_random_uuid()::text, 'General Surgery', 'الجراحة العامة', TRUE, NOW(), NOW()),
  (gen_random_uuid()::text, 'Ophthalmology', 'طب العيون', TRUE, NOW(), NOW()),
  (gen_random_uuid()::text, 'ENT', 'الأنف والأذن والحنجرة', TRUE, NOW(), NOW())
ON CONFLICT ("name") DO UPDATE SET
  "nameAr" = EXCLUDED."nameAr",
  "isActive" = TRUE;

UPDATE "specialties"
SET "name" = 'Sports Medicine', "nameAr" = 'طب الرياضة', "updatedAt" = NOW()
WHERE "name" = 'Sports Injuries';

-- 3) Reparent existing orthopedic areas without changing their IDs
UPDATE "specialties" child
SET "parentId" = parent.id, "updatedAt" = NOW()
FROM "specialties" parent
WHERE parent."name" = 'Orthopedics'
  AND child."name" IN (
    'Shoulder', 'Elbow', 'Hand', 'Wrist', 'Hip', 'Pelvis', 'Knee',
    'Foot', 'Ankle', 'Spine', 'Trauma', 'Sports Medicine',
    'Pediatric Orthopedics', 'Joint Replacement', 'Arthroscopy'
  )
  AND (child."parentId" IS DISTINCT FROM parent.id);

-- 4) Additional children (new IDs only when missing)
INSERT INTO "specialties" ("id", "name", "nameAr", "parentId", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, v.name, v."nameAr", p.id, TRUE, NOW(), NOW()
FROM (VALUES
  ('Dermatology', 'General Dermatology', 'الأمراض الجلدية العامة'),
  ('Dermatology', 'Pediatric Dermatology', 'جلدية الأطفال'),
  ('Dermatology', 'Cosmetic Dermatology', 'الجلدية التجميلية'),
  ('Dermatology', 'Dermatologic Surgery', 'جراحة الجلد'),
  ('General Surgery', 'Colorectal', 'جراحة القولون والمستقيم'),
  ('General Surgery', 'Breast Surgery', 'جراحة الثدي'),
  ('General Surgery', 'Hernia Surgery', 'جراحة الفتق'),
  ('Ophthalmology', 'Cataract', 'المياه البيضاء'),
  ('Ophthalmology', 'Retina', 'الشبكية'),
  ('Ophthalmology', 'Cornea', 'القرنية'),
  ('Ophthalmology', 'Glaucoma', 'المياه الزرقاء'),
  ('ENT', 'Otology', 'طب الأذن'),
  ('ENT', 'Rhinology', 'طب الأنف'),
  ('ENT', 'Laryngology', 'طب الحنجرة'),
  ('ENT', 'Head & Neck', 'الرأس والعنق')
) AS v(parent_name, name, "nameAr")
JOIN "specialties" p ON p."name" = v.parent_name
WHERE NOT EXISTS (SELECT 1 FROM "specialties" s WHERE s."name" = v.name);

UPDATE "specialties" child
SET "parentId" = parent.id, "updatedAt" = NOW()
FROM "specialties" parent
WHERE parent."name" = 'Dermatology'
  AND child."name" IN ('General Dermatology', 'Pediatric Dermatology', 'Cosmetic Dermatology', 'Dermatologic Surgery');

UPDATE "specialties" child
SET "parentId" = parent.id, "updatedAt" = NOW()
FROM "specialties" parent
WHERE parent."name" = 'General Surgery'
  AND child."name" IN ('Colorectal', 'Breast Surgery', 'Hernia Surgery');

UPDATE "specialties" child
SET "parentId" = parent.id, "updatedAt" = NOW()
FROM "specialties" parent
WHERE parent."name" = 'Ophthalmology'
  AND child."name" IN ('Cataract', 'Retina', 'Cornea', 'Glaucoma');

UPDATE "specialties" child
SET "parentId" = parent.id, "updatedAt" = NOW()
FROM "specialties" parent
WHERE parent."name" = 'ENT'
  AND child."name" IN ('Otology', 'Rhinology', 'Laryngology', 'Head & Neck');

-- General Surgery child that shares the parent name is skipped; use "General Procedures" area instead if needed.

-- 5) Move doctor child-specialty links into DoctorSubspecialty, then attach the parent
INSERT INTO "doctor_subspecialties" ("id", "doctorId", "specialtyId", "createdAt")
SELECT gen_random_uuid()::text, ds."doctorId", ds."specialtyId", NOW()
FROM "doctor_specialties" ds
JOIN "specialties" s ON s.id = ds."specialtyId"
WHERE s."parentId" IS NOT NULL
ON CONFLICT ("doctorId", "specialtyId") DO NOTHING;

INSERT INTO "doctor_specialties" ("id", "doctorId", "specialtyId", "createdAt")
SELECT gen_random_uuid()::text, ds."doctorId", s."parentId", NOW()
FROM "doctor_specialties" ds
JOIN "specialties" s ON s.id = ds."specialtyId"
WHERE s."parentId" IS NOT NULL
ON CONFLICT ("doctorId", "specialtyId") DO NOTHING;

DELETE FROM "doctor_specialties" ds
USING "specialties" s
WHERE ds."specialtyId" = s.id
  AND s."parentId" IS NOT NULL;

-- 6) Catalog: keep the body-area as subspecialty, point specialtyId at the parent
UPDATE "operation_catalog" c
SET "subspecialtyId" = c."specialtyId",
    "specialtyId" = s."parentId",
    "updatedAt" = NOW()
FROM "specialties" s
WHERE c."specialtyId" = s.id
  AND s."parentId" IS NOT NULL
  AND (c."subspecialtyId" IS DISTINCT FROM c."specialtyId"
       OR c."specialtyId" IS DISTINCT FROM s."parentId");

-- 7) Surgical cases: specialtyId should be the top-level specialty
UPDATE "operations" o
SET "specialtyId" = s."parentId",
    "updatedAt" = NOW()
FROM "specialties" s
WHERE o."specialtyId" = s.id
  AND s."parentId" IS NOT NULL;
