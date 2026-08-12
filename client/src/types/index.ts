/* ============================================================
   MedAxis – TypeScript Type Definitions
   Orthopedic Surgery SaaS Application
   ============================================================ */

// ──────────────────────────────────────────────
// String Enums
// ──────────────────────────────────────────────

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
}

export enum OperationStatus {
  Scheduled = 'SCHEDULED',
  CheckedIn = 'CHECKED_IN',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  NoShow = 'NO_SHOW',
}

export enum PaymentMethod {
  Cash = 'CASH',
  Card = 'CARD',
  Insurance = 'INSURANCE',
  BankTransfer = 'BANK_TRANSFER',
  Other = 'OTHER',
}

export enum PaymentStatus {
  Paid = 'PAID',
  Unpaid = 'UNPAID',
  Partial = 'PARTIAL',
}

export enum FileType {
  BeforeOperation = 'BEFORE_OPERATION',
  AfterOperation = 'AFTER_OPERATION',
}

export enum TimelineAction {
  Created = 'CREATED',
  StatusChanged = 'STATUS_CHANGED',
  CostUpdated = 'COST_UPDATED',
  FileUploaded = 'FILE_UPLOADED',
  FileRemoved = 'FILE_REMOVED',
  TeamUpdated = 'TEAM_UPDATED',
  PaymentRecorded = 'PAYMENT_RECORDED',
  NotesUpdated = 'NOTES_UPDATED',
}

// ──────────────────────────────────────────────
// Entity Interfaces
// ──────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SURGEON' | 'ASSISTANT';
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  mobile: string;
  email: string | null;
  gender: Gender;
  dateOfBirth: string | null;
  nationalId: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    operations: number;
  };
}

export interface Specialty {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    operations: number;
    doctors: number;
  };
}

export interface Doctor {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  specialtyId: string;
  licenseNumber: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  specialty?: Specialty;
  _count?: {
    operationsAsPrimary: number;
    operationsAsAssistant: number;
    operationsAsAnesthetist: number;
  };
}

export interface Hospital {
  id: string;
  name: string;
  nameAr: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    operations: number;
  };
}

export interface Operation {
  id: string;
  name: string;
  diagnosis: string | null;
  patientId: string;
  hospitalId: string;
  specialtyId: string;
  operationDate: string;
  operationTime: string;
  operationRoom: string | null;
  duration: number | null;
  status: OperationStatus;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  hospital?: Hospital;
  specialty?: Specialty;
  cost?: OperationCost;
  files?: OperationFile[];
  timeline?: OperationTimeline[];
  medicalTeam?: OperationMedicalTeam;
}

export interface OperationCost {
  id: string;
  operationId: string;
  totalCost: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationFile {
  id: string;
  operationId: string;
  fileName: string;
  fileUrl: string;
  fileType: FileType;
  fileSize: number | null;
  mimeType: string | null;
  uploadedBy: string;
  createdAt: string;
}

export interface OperationTimeline {
  id: string;
  operationId: string;
  action: TimelineAction;
  description: string | null;
  oldStatus: OperationStatus | null;
  newStatus: OperationStatus | null;
  metadata: Record<string, unknown> | null;
  performedBy: string;
  createdAt: string;
  performedByUser?: {
    id: string;
    name: string;
  };
}

export interface OperationMedicalTeam {
  id: string;
  operationId: string;
  primarySurgeonId: string | null;
  assistantSurgeonId: string | null;
  anesthesiologistId: string | null;
  assistantAnesthesiaId: string | null;
  nurseId: string | null;
  createdAt: string;
  updatedAt: string;
  primarySurgeon?: Doctor;
  assistantSurgeon?: Doctor;
  anesthesiologist?: Doctor;
  assistantAnesthesia?: Doctor;
  nurse?: Doctor;
}

// ──────────────────────────────────────────────
// API Response Types
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ──────────────────────────────────────────────
// Auth Types
// ──────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// ──────────────────────────────────────────────
// Patient Types
// ──────────────────────────────────────────────

export interface CreatePatientPayload {
  fullName: string;
  mobile: string;
  email?: string;
  gender: Gender;
  dateOfBirth?: string;
  nationalId?: string;
  notes?: string;
}

export interface UpdatePatientPayload extends Partial<CreatePatientPayload> {}

// ──────────────────────────────────────────────
// Operation Types
// ──────────────────────────────────────────────

export interface CreateOperationPayload {
  name: string;
  diagnosis?: string;
  patientId: string;
  hospitalId: string;
  specialtyId: string;
  operationDate: string;
  operationTime: string;
  operationRoom?: string;
  duration?: number;
  notes?: string;
  primarySurgeonId?: string;
  assistantSurgeonId?: string;
  anesthesiologistId?: string;
  assistantAnesthesiaId?: string;
  nurseId?: string;
  totalCost?: number;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentNotes?: string;
}

export interface UpdateOperationPayload extends Partial<CreateOperationPayload> {
  status?: OperationStatus;
}

export interface OperationFilters extends PaginatedQuery {
  search?: string;
  status?: OperationStatus;
  specialtyId?: string;
  hospitalId?: string;
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentStatus?: PaymentStatus;
}

// ──────────────────────────────────────────────
// Doctor Types
// ──────────────────────────────────────────────

export interface CreateDoctorPayload {
  name: string;
  mobile: string;
  email?: string;
  specialtyId: string;
  licenseNumber?: string;
  notes?: string;
  isActive?: boolean;
}

// ──────────────────────────────────────────────
// Hospital Types
// ──────────────────────────────────────────────

export interface CreateHospitalPayload {
  name: string;
  nameAr?: string;
  address?: string;
  city?: string;
  phone?: string;
  notes?: string;
  isActive?: boolean;
}

// ──────────────────────────────────────────────
// Specialty Types
// ──────────────────────────────────────────────

export interface CreateSpecialtyPayload {
  name: string;
  nameAr?: string;
  description?: string;
  icon?: string;
  color?: string;
}

// ──────────────────────────────────────────────
// Dashboard Types
// ──────────────────────────────────────────────

export interface DashboardStats {
  totalPatients: number;
  totalOperations: number;
  operationsThisMonth: number;
  completedOperations: number;
  upcomingOperations: number;
  totalRevenue: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
  completed: number;
  cancelled: number;
}

export interface SpecialtyDistribution {
  specialtyId: string;
  specialtyName: string;
  count: number;
  percentage: number;
}

// ──────────────────────────────────────────────
// Search Types
// ──────────────────────────────────────────────

export interface SearchFilters {
  query: string;
  page?: number;
  limit?: number;
  type?: 'patients' | 'operations' | 'doctors' | 'hospitals' | 'all';
  dateFrom?: string;
  dateTo?: string;
}
