-- DropForeignKey
ALTER TABLE "operation_medical_team" DROP CONSTRAINT "operation_medical_team_anesthesiologistId_fkey";

-- DropForeignKey
ALTER TABLE "operation_medical_team" DROP CONSTRAINT "operation_medical_team_assistantAnesthesiaId_fkey";

-- DropForeignKey
ALTER TABLE "operation_medical_team" DROP CONSTRAINT "operation_medical_team_assistantSurgeonId_fkey";

-- DropForeignKey
ALTER TABLE "operation_medical_team" DROP CONSTRAINT "operation_medical_team_primarySurgeonId_fkey";

-- DropForeignKey
ALTER TABLE "operations" DROP CONSTRAINT "operations_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_createdBy_fkey";

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_primarySurgeonId_fkey" FOREIGN KEY ("primarySurgeonId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_assistantSurgeonId_fkey" FOREIGN KEY ("assistantSurgeonId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_anesthesiologistId_fkey" FOREIGN KEY ("anesthesiologistId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_medical_team" ADD CONSTRAINT "operation_medical_team_assistantAnesthesiaId_fkey" FOREIGN KEY ("assistantAnesthesiaId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
