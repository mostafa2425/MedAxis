import type React from 'react';
import type {
  Gender,
  OperationStatus,
  PaymentMethod,
  PaymentStatus,
} from '@/types';

export interface WizardFormData {
  // Step 1 – Patient
  patientSearchQuery: string;
  patientId: string;
  selectedPatientName: string;
  selectedPatientMobile: string;
  isNewPatient: boolean;
  newPatientName: string;
  newPatientAge: number | null;
  newPatientGender: Gender;
  newPatientMobile: string;

  // Step 2 – Operation
  operationIds: string[];
  operationId: string;
  name: string;
  diagnosis: string;
  hospitalId: string;
  specialtyId: string;
  operationDate: string;
  operationTime: string;
  operationRoom: string;
  duration: number | null;
  status: OperationStatus;

  // Step 3 – Team
  doctorIds: string[];
  nurseIds: string[];
  primarySurgeonId: string;
  assistantSurgeonId: string;
  anesthesiologistId: string;
  assistantAnesthesiaId: string;
  nurseId: string;
  teamNotes: string;

  // Step 4 – Cost
  totalCost: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentNotes: string;

  // Notes
  notes: string;
}

export type WizardFormSetter = React.Dispatch<React.SetStateAction<WizardFormData>>;

export interface WizardStepBaseProps {
  formData: WizardFormData;
  setFormData: WizardFormSetter;
  errors?: Record<string, string | undefined>;
  clearError?: (field: string) => void;
}

/** Alias for steps that use the shared formData / setFormData / errors pattern. */
export type WizardStepProps = WizardStepBaseProps;
