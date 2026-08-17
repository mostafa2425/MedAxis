import type { ComponentType } from 'react';
import { UserOutlined, MedicineBoxOutlined, TeamOutlined, DollarOutlined, CloudUploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Gender, OperationStatus, PaymentMethod, PaymentStatus } from '@/types';
import type { WizardFormData } from './wizardTypes';

export interface WizardStepDef { key: string; icon: ComponentType; }
export const STEPS: readonly WizardStepDef[] = [
  { key: 'patient', icon: UserOutlined }, { key: 'operation', icon: MedicineBoxOutlined }, { key: 'team', icon: TeamOutlined }, { key: 'cost', icon: DollarOutlined }, { key: 'files', icon: CloudUploadOutlined }, { key: 'review', icon: CheckCircleOutlined },
] as const;
export const LAST_USED_HOSPITAL_KEY = 'medaxis_lastUsedHospital';
export const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.dicom,.avi,.mp4,.mov';
export function getDefaultFormData(): WizardFormData {
  const lastHospital = typeof window !== 'undefined' ? localStorage.getItem(LAST_USED_HOSPITAL_KEY) : null;
  return {
    patientSearchQuery: '', patientId: '', selectedPatientName: '', selectedPatientMobile: '', isNewPatient: false, newPatientName: '', newPatientAge: null, newPatientGender: Gender.Male, newPatientMobile: '',
    operationIds: [], operationId: '', name: '', diagnosis: '', hospitalId: lastHospital || '', specialtyId: '', operationDate: dayjs().format('YYYY-MM-DD'), operationTime: dayjs().format('HH:mm'), operationRoom: '', duration: null, status: OperationStatus.Completed,
    doctorIds: [], nurseIds: [], primarySurgeonId: '', assistantSurgeonId: '', anesthesiologistId: '', assistantAnesthesiaId: '', nurseId: '', teamNotes: '',
    totalCost: 0, paidAmount: 0, hospitalCost: 0, nursingCost: 0, assistantDoctorsCost: 0, equipmentCost: 0, otherCost: 0, paymentMethod: PaymentMethod.Cash, paymentStatus: PaymentStatus.Paid, paymentNotes: '', notes: '',
  };
}
