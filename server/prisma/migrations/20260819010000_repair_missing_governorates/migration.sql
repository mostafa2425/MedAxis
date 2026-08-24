-- Repair migration for databases where the governorates migration was
-- previously marked/applied without the table being present.
--
-- The project has historically used TEXT ids, while some deployed databases
-- use UUID ids. Match the existing hospitals.governorateId type so this repair
-- is safe for both shapes.

DO $$
DECLARE
  governorate_id_type text;
BEGIN
  SELECT CASE
    WHEN udt_name = 'uuid' THEN 'uuid'
    ELSE 'text'
  END
  INTO governorate_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'hospitals'
    AND column_name = 'governorateId';

  IF governorate_id_type IS NULL THEN
    governorate_id_type := 'text';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'governorates'
  ) THEN
    IF governorate_id_type = 'uuid' THEN
      EXECUTE 'CREATE TABLE public.governorates (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), "nameEn" text NOT NULL, "nameAr" text NOT NULL, code text NOT NULL, "isActive" boolean NOT NULL DEFAULT true)';
    ELSE
      EXECUTE 'CREATE TABLE public.governorates (id text PRIMARY KEY, "nameEn" text NOT NULL, "nameAr" text NOT NULL, code text NOT NULL, "isActive" boolean NOT NULL DEFAULT true)';
    END IF;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "governorates_nameEn_key"
  ON public.governorates ("nameEn");
CREATE UNIQUE INDEX IF NOT EXISTS "governorates_nameAr_key"
  ON public.governorates ("nameAr");
CREATE UNIQUE INDEX IF NOT EXISTS "governorates_code_key"
  ON public.governorates (code);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hospitals'
      AND column_name = 'governorateId'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.hospitals'::regclass
      AND conname = 'hospitals_governorateid_fkey'
  ) THEN
    ALTER TABLE public.hospitals
      ADD CONSTRAINT hospitals_governorateid_fkey
      FOREIGN KEY ("governorateId")
      REFERENCES public.governorates(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;
