-- Keep the database aligned with the Prisma OperationCatalog model.
-- Custom catalog entries do not require a specialty, so specialtyId must be nullable.
ALTER TABLE "operation_catalog"
  ALTER COLUMN "specialtyId" DROP NOT NULL;
