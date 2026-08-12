import { OperationStatus, PaymentMethod, PaymentStatus, FileType, Gender } from '@/types';

// ──────────────────────────────────────────────
// Operation Statuses
// ──────────────────────────────────────────────
export const OPERATION_STATUSES = [
  { value: OperationStatus.Scheduled, label: 'Scheduled', color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  { value: OperationStatus.CheckedIn, label: 'Checked In', color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
  { value: OperationStatus.InProgress, label: 'In Progress', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  { value: OperationStatus.Completed, label: 'Completed', color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
  { value: OperationStatus.Cancelled, label: 'Cancelled', color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  { value: OperationStatus.NoShow, label: 'No Show', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
] as const;

// ──────────────────────────────────────────────
// Payment Methods
// ──────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { value: PaymentMethod.Cash, label: 'Cash', color: '#16A34A' },
  { value: PaymentMethod.Card, label: 'Card', color: '#2563EB' },
  { value: PaymentMethod.Insurance, label: 'Insurance', color: '#7C3AED' },
  { value: PaymentMethod.BankTransfer, label: 'Bank Transfer', color: '#0284C7' },
  { value: PaymentMethod.Other, label: 'Other', color: '#64748B' },
] as const;

// ──────────────────────────────────────────────
// Payment Statuses
// ──────────────────────────────────────────────
export const PAYMENT_STATUSES = [
  { value: PaymentStatus.Paid, label: 'Paid', color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
  { value: PaymentStatus.Unpaid, label: 'Unpaid', color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  { value: PaymentStatus.Partial, label: 'Partial', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
] as const;

// ──────────────────────────────────────────────
// File Types Before Operation
// ──────────────────────────────────────────────
export const FILE_TYPES_BEFORE = [
  { value: FileType.BeforeOperation, label: 'Before Operation', color: '#2563EB' },
] as const;

// ──────────────────────────────────────────────
// File Types After Operation
// ──────────────────────────────────────────────
export const FILE_TYPES_AFTER = [
  { value: FileType.AfterOperation, label: 'After Operation', color: '#16A34A' },
] as const;

// ──────────────────────────────────────────────
// Genders
// ──────────────────────────────────────────────
export const GENDERS = [
  { value: Gender.Male, label: 'Male' },
  { value: Gender.Female, label: 'Female' },
] as const;

// ──────────────────────────────────────────────
// Orthopedic Categories (15 items)
// ──────────────────────────────────────────────
export const ORTHOPEDIC_CATEGORIES = [
  { key: 'joint_replacement', label: 'Joint Replacement', labelAr: 'استبدال المفاصل' },
  { key: 'sports_medicine', label: 'Sports Medicine', labelAr: 'طب الرياضة' },
  { key: 'spine_surgery', label: 'Spine Surgery', labelAr: 'جراحة العمود الفقري' },
  { key: 'trauma_fractures', label: 'Trauma & Fractures', labelAr: 'الرضوح والكسور' },
  { key: 'hand_surgery', label: 'Hand Surgery', labelAr: 'جراحة اليد' },
  { key: 'foot_ankle', label: 'Foot & Ankle', labelAr: 'القدم والكاحل' },
  { key: 'shoulder_elbow', label: 'Shoulder & Elbow', labelAr: 'الكتف والمرفق' },
  { key: 'pediatric_orthopedics', label: 'Pediatric Orthopedics', labelAr: 'جراحة العظام للأطفال' },
  { key: 'orthopedic_oncology', label: 'Orthopedic Oncology', labelAr: 'أورام العظام' },
  { key: 'arthroscopy', label: 'Arthroscopy', labelAr: 'تنظير المفاصل' },
  { key: 'reconstructive', label: 'Reconstructive Surgery', labelAr: 'الجراحة الترميمية' },
  { key: 'general_orthopedics', label: 'General Orthopedics', labelAr: 'جراحة العظام العامة' },
  { key: 'limb_deformity', label: 'Limb Deformity Correction', labelAr: 'تصحيح تشوهات الأطراف' },
  { key: 'bone_infection', label: 'Bone Infection (Osteomyelitis)', labelAr: 'التهاب العظام والنخاع' },
  { key: 'joint_preservation', label: 'Joint Preservation', labelAr: 'حفظ المفاصل' },
] as const;

// ──────────────────────────────────────────────
// Default Pagination
// ──────────────────────────────────────────────
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;
