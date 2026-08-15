import { OPERATION_STATUSES } from '@/utils/constants';
import type { OperationStatus } from '@/types';

export function getStatusBg(status: OperationStatus): string {
  const found = OPERATION_STATUSES.find((s) => s.value === status);
  return found?.bg ?? 'rgba(148,163,184,0.1)';
}

export const WIZARD_FIELD_STEPS: Record<string, number> = {
  patientId: 0,
  newPatientName: 0,
  newPatientAge: 0,
  newPatientGender: 0,
  newPatientMobile: 0,
  name: 1,
  operationId: 1,
  operationIds: 1,
  diagnosis: 1,
  hospitalId: 1,
  specialtyId: 1,
  operationDate: 1,
  operationTime: 1,
  operationRoom: 1,
  duration: 1,
  status: 1,
  doctorIds: 2,
  nurseIds: 2,
  primarySurgeonId: 2,
  assistantSurgeonId: 2,
  anesthesiologistId: 2,
  assistantAnesthesiaId: 2,
  nurseId: 2,
  nurse: 2,
  teamNotes: 2,
  totalCost: 3,
  paidAmount: 3,
  remainingAmount: 3,
  paymentMethod: 3,
  paymentStatus: 3,
  paymentNotes: 3,
};

export function resolveWizardErrorStep(fields: string[], currentStep: number): number {
  const steps = fields
    .map((field) => WIZARD_FIELD_STEPS[field] ?? WIZARD_FIELD_STEPS[field.split('.').pop() ?? ''])
    .filter((step): step is number => typeof step === 'number');

  if (steps.length === 0) return currentStep;
  if (steps.includes(currentStep)) return currentStep;
  return Math.min(...steps);
}
