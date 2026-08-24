-- MedAxis baseline migration
-- Reconstructs the existing Prisma schema so subsequent migrations can be
-- replayed cleanly in Prisma shadow databases. This migration is intended to
-- be marked as already applied on databases that already contain this schema.

CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');
CREATE TYPE "OperationStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'INSURANCE', 'BANK_TRANSFER', 'OTHER');
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'PARTIAL');
CREATE TYPE "FileType" AS ENUM ('BEFORE_IMAGE', 'BEFORE_XRAY', 'BEFORE_MRI', 'BEFORE_CT', 'BEFORE_LAB', 'BEFORE_PDF', 'AFTER_IMAGE', 'AFTER_REPORT', 'AFTER_PDF', 'AFTER_OTHER');
CREATE TYPE "TimelineAction" AS ENUM ('OPERATION_CREATED', 'OPERATION_UPDATED', 'OPERATION_DELETED', 'STATUS_CHANGED', 'FILES_UPLOADED', 'COST_UPDATED', 'NOTES_UPDATED', 'TEAM_UPDATED');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "role" TEXT NOT NULL DEFAULT 'doctor',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE TABLE "patients" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "gender" "Gender" NOT NULL DEFAULT 'MALE',
  "mobile" TEXT,
  "notes" TEXT,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "specialties" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "icon" TEXT,
  "parentId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "specialties_name_key" ON "specialties"("name");
CREATE INDEX "specialties_parentId_idx" ON "specialties"("parentId");

CREATE TABLE "doctors" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "userId" TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");
CREATE INDEX "doctors_createdBy_idx" ON "doctors"("createdBy");

CREATE TABLE "doctor_specialties" (
  "id" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "doctor_specialties_doctorId_specialtyId_key" ON "doctor_specialties"("doctorId", "specialtyId");

CREATE TABLE "doctor_subspecialties" (
  "id" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "doctor_subspecialties_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "doctor_subspecialties_doctorId_specialtyId_key" ON "doctor_subspecialties"("doctorId", "specialtyId");

CREATE TABLE "operation_catalog" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "specialtyId" TEXT,
  "subspecialtyId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isCustom" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "operation_catalog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "operation_catalog_specialtyId_idx" ON "operation_catalog"("specialtyId");
CREATE INDEX "operation_catalog_subspecialtyId_idx" ON "operation_catalog"("subspecialtyId");
CREATE INDEX "operation_catalog_createdBy_idx" ON "operation_catalog"("createdBy");
CREATE INDEX "operation_catalog_name_specialtyId_idx" ON "operation_catalog"("name", "specialtyId");

CREATE TABLE "governorates" (
  "id" TEXT NOT NULL,
  "nameEn" TEXT NOT NULL,
  "nameAr" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "governorates_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "governorates_nameEn_key" ON "governorates"("nameEn");
CREATE UNIQUE INDEX "governorates_nameAr_key" ON "governorates"("nameAr");
CREATE UNIQUE INDEX "governorates_code_key" ON "governorates"("code");

CREATE TABLE "hospitals" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "address" TEXT,
  "city" TEXT,
  "governorateId" TEXT,
  "phone" TEXT,
  "notes" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "hospitals_createdBy_idx" ON "hospitals"("createdBy");
CREATE INDEX "hospitals_governorateId_idx" ON "hospitals"("governorateId");

CREATE TABLE "nurses" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "nurses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "nurses_createdBy_idx" ON "nurses"("createdBy");

CREATE TABLE "operations" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "diagnosis" TEXT,
  "hospitalId" TEXT NOT NULL,
  "operationDate" TIMESTAMPTZ(6) NOT NULL,
  "operationTime" TEXT NOT NULL,
  "operationRoom" TEXT,
  "duration" INTEGER,
  "status" "OperationStatus" NOT NULL DEFAULT 'COMPLETED',
  "notes" TEXT,
  "patientId" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "specialtyId" TEXT,
  "catalogId" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "operation_medical_team" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "primarySurgeonId" TEXT,
  "assistantSurgeonId" TEXT,
  "anesthesiologistId" TEXT,
  "assistantAnesthesiaId" TEXT,
  "nurse" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_medical_team_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "operation_procedures" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "catalogId" TEXT,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "specialtyId" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_procedures_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "operation_procedures_operationId_idx" ON "operation_procedures"("operationId");
CREATE INDEX "operation_procedures_catalogId_idx" ON "operation_procedures"("catalogId");

CREATE TABLE "operation_team_members" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "doctorId" TEXT,
  "nurseId" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_team_members_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "operation_team_members_operationId_idx" ON "operation_team_members"("operationId");
CREATE INDEX "operation_team_members_doctorId_idx" ON "operation_team_members"("doctorId");
CREATE INDEX "operation_team_members_nurseId_idx" ON "operation_team_members"("nurseId");

CREATE TABLE "operation_costs" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "totalCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "remainingAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "hospitalCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "nursingCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "assistantDoctorsCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "equipmentCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "otherCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PAID',
  "paymentNotes" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "operation_costs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "operation_costs_operationId_key" ON "operation_costs"("operationId");

CREATE TABLE "operation_files" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "fileType" "FileType" NOT NULL,
  "fileName" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "fileSize" INTEGER,
  "mimeType" TEXT,
  "uploadedBy" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "operation_timeline" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "action" "TimelineAction" NOT NULL,
  "description" TEXT,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "operation_timeline_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "patients" ADD CONSTRAINT "patients_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "specialties" ADD CONSTRAINT "specialties_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "doctor_subspecialties" ADD CONSTRAINT "doctor_subspecialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "doctor_subspecialties" ADD CONSTRAINT "doctor_subspecialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operation_catalog" ADD CONSTRAINT "operation_catalog_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "operation_catalog" ADD CONSTRAINT "operation_catalog_subspecialtyId_fkey" FOREIGN KEY ("subspecialtyId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "operation_catalog" ADD CONSTRAINT "operation_catalog_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_governorateId_fkey" FOREIGN KEY ("governorateId") REFERENCES "governorates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "nurses" ADD CONSTRAINT "nurses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operations" ADD CONSTRAINT "operations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operations" ADD CONSTRAINT "operations_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operations" ADD CONSTRAINT "operations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operations" ADD CONSTRAINT "operations_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operations" ADD CONSTRAINT "operations_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "operation_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_primarySurgeonId_fkey" FOREIGN KEY ("primarySurgeonId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_assistantSurgeonId_fkey" FOREIGN KEY ("assistantSurgeonId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_anesthesiologistId_fkey" FOREIGN KEY ("anesthesiologistId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_assistantAnesthesiaId_fkey" FOREIGN KEY ("assistantAnesthesiaId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operation_procedures" ADD CONSTRAINT "operation_procedures_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operation_procedures" ADD CONSTRAINT "operation_procedures_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "operation_catalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "operation_procedures" ADD CONSTRAINT "operation_procedures_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "operation_team_members" ADD CONSTRAINT "operation_team_members_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operation_team_members" ADD CONSTRAINT "operation_team_members_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "operation_team_members" ADD CONSTRAINT "operation_team_members_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "nurses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "operation_costs" ADD CONSTRAINT "operation_costs_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operation_files" ADD CONSTRAINT "operation_files_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operation_files" ADD CONSTRAINT "operation_files_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "operation_timeline" ADD CONSTRAINT "operation_timeline_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "operation_timeline" ADD CONSTRAINT "operation_timeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
