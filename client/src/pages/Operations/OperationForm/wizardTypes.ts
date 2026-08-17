import type React from 'react';
import type { Gender, OperationStatus, PaymentMethod, PaymentStatus } from '@/types';

export interface WizardFormData {
  patientSearchQuery: string; patientId: string; selectedPatientName: string; selectedPatientMobile: string; isNewPatient: boolean; newPatientName: string; newPatientAge: number | null; newPatientGender: Gender; newPatientMobile: string;
  operationIds: string[]; operationId: string; name: string; diagnosis: string; hospitalId: string; specialtyId: string; operationDate: string; operationTime: string; operationRoom: string; duration: number | null; status: OperationStatus;
  doctorIds: string[]; nurseIds: string[]; primarySurgeonId: string; assistantSurgeonId: string; anesthesiologistId: string; assistantAnesthesiaId: string; nurseId: string; teamNotes: string;
  totalCost: number; paidAmount: number; hospitalCost: number; nursingCost: number; assistantDoctorsCost: number; equipmentCost: number; otherCost: number; paymentMethod: PaymentMethod; paymentStatus: PaymentStatus; paymentNotes: string;
  notes: string;
}

export type WizardFormSetter = React.Dispatch<React.SetStateAction<WizardFormData>>;
export interface WizardStepBaseProps { formData: WizardFormData; setFormData: WizardFormSetter; errors?: Record<string, string | undefined>; clearError?: (field: string) => void; }
export type WizardStepProps = WizardStepBaseProps;
