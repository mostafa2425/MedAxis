/* ============================================================
   MedAxis – TypeScript Type Definitions
   Orthopedic Surgery SaaS Application
   ============================================================ */

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

export type FollowUpStatus = 'UPCOMING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

export interface OperationFollowUp {
  id: string;
  operationId: string;
  title: string;
  scheduledAt: string;
  completedAt: string | null;
  status: FollowUpStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  avatarUrl?: string | null;
  isActive: boolean;
  doctorId?: string | null;
  specialties?: DoctorSpecialtyRef[];
  subspecialties?: DoctorSpecialtyRef[];
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  mobile: string | null;
  gender: Gender;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  _count?: { operations: number };
}

export interface Specialty {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { operations: number; doctors: number };
}

export interface DoctorSpecialtyRef {
  id: string;
  name: string;
  nameAr: string | null;
}

export interface Doctor {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  specialties: DoctorSpecialtyRef[];
  subspecialties?: DoctorSpecialtyRef[];
  _count?: { operationsAsPrimary: number; operationsAsAssistant: number; operationsAsAnesthetist: number };
}

export interface Nurse {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperationProcedure {
  id: string;
  operationId: string;
  catalogId: string | null;
  name: string;
  nameAr?: string | null;
  specialtyId: string | null;
  sortOrder: number;
  catalog?: OperationCatalogItem | null;
  specialty?: DoctorSpecialtyRef | null;
}

export interface OperationTeamMember {
  id: string;
  operationId: string;
  doctorId: string | null;
  nurseId: string | null;
  sortOrder: number;
  doctor?: Doctor | null;
  nurse?: Nurse | null;
}

export interface Hospital {
  id: string;
  name: string;
  nameAr: string | null;
  address: string | null;
  city: string | null;
  governorateId?: string | null;
  governorate?: { id: string; nameEn: string; nameAr: string; code: string } | null;
  phone: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { operations: number };
}

export interface OperationCatalogItem {
  id: string;
  name: string;
  nameAr: string | null;
  isCustom: boolean;
  specialty: DoctorSpecialtyRef | null;
  subspecialty?: DoctorSpecialtyRef | null;
}

export interface Operation {
  id: string;
  name: string;
  diagnosis: string | null;
  patientId: string;
  hospitalId: string;
  specialtyId: string | null;
  catalogId?: string | null;
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
  catalog?: OperationCatalogItem | null;
  procedures?: OperationProcedure[];
  teamMembers?: OperationTeamMember[];
  cost?: OperationCost;
  files?: OperationFile[];
  timeline?: OperationTimeline[];
  medicalTeam?: OperationMedicalTeam;
  followUps?: OperationFollowUp[];
}

export interface OperationCost {
  id: string;
  operationId: string;
  totalCost: number;
  paidAmount: number;
  remainingAmount?: number;
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
  url?: string;
  filePath?: string;
  fileType: string;
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
  performedByUser?: { id: string; name: string };
}

export interface OperationMedicalTeam {
  id: string;
  operationId: string;
  primarySurgeonId: string | null;
  assistantSurgeonId: string | null;
  anesthesiologistId: string | null;
  assistantAnesthesiaId: string | null;
  nurse?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  primarySurgeon?: Doctor;
  assistantSurgeon?: Doctor;
  anesthesiologist?: Doctor;
  assistantAnesthesia?: Doctor;
}

export interface ApiResponse<T> { success: boolean; data: T; message?: string; }
export interface PaginationMeta { page: number; limit: number; total: number; totalPages: number; }
export interface PaginatedResponse<T> { success: boolean; data: T[]; pagination?: PaginationMeta; meta?: PaginationMeta; message?: string; }
export interface PaginatedQuery { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; parentId?: string; parentIds?: string; mine?: boolean; rootsOnly?: boolean; }
export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; phone?: string; specialtyIds: string[]; subspecialtyIds?: string[]; }
export interface UpdateProfilePayload { name?: string; phone?: string | null; specialtyIds?: string[]; subspecialtyIds?: string[]; }
export interface LoginResponse { user: User; token: string; }
export interface CreatePatientPayload { fullName: string; age: number; gender: Gender; mobile?: string; notes?: string; }
export interface UpdatePatientPayload extends Partial<CreatePatientPayload> {}
export interface CreateOperationPayload { operationId?: string; operationIds?: string[]; name?: string; diagnosis?: string | null; patientId: string; hospitalId: string; specialtyId?: string; operationDate: string; operationTime: string; operationRoom?: string; duration?: number; status?: OperationStatus; notes?: string; medicalTeam?: { doctorIds?: string[]; nurseIds?: string[]; primarySurgeonId?: string; assistantSurgeonId?: string; anesthesiologistId?: string; assistantAnesthesiaId?: string; nurse?: string; notes?: string; }; cost?: { totalCost: number; paidAmount?: number; remainingAmount?: number; paymentMethod?: PaymentMethod; paymentStatus?: PaymentStatus; paymentNotes?: string; }; }
export interface UpdateOperationPayload extends Partial<CreateOperationPayload> { status?: OperationStatus; }
export interface OperationFilters extends PaginatedQuery { search?: string; status?: OperationStatus; specialtyId?: string; hospitalId?: string; doctorId?: string; dateFrom?: string; dateTo?: string; paymentStatus?: PaymentStatus; }
export interface CreateDoctorPayload { name: string; phone?: string; email?: string; specialtyIds: string[]; subspecialtyIds?: string[]; isActive?: boolean; }
export interface CreateHospitalPayload { name: string; nameAr?: string; address?: string; city?: string; governorateId?: string; phone?: string; notes?: string; isActive?: boolean; }
export interface CreateSpecialtyPayload { name: string; nameAr?: string; description?: string; icon?: string; color?: string; }
export interface DashboardStats { totalPatients: number; totalOperations: number; operationsThisMonth: number; completedOperations: number; pendingOperations: number; cancelledOperations: number; totalDoctors: number; totalNurses: number; totalHospitals: number; upcomingOperations?: number; totalRevenue?: number; paidAmount?: number; pendingAmount?: number; statusBreakdown?: Record<string, number>; revenue?: { totalCost: number; totalPaid: number; totalRemaining: number; }; }
export interface MonthlyTrend { month: string; total: number; completed: number; cancelled: number; }
export interface SpecialtyDistribution { specialtyId: string; specialtyName: string; count: number; percentage: number; }
export interface SearchFilters { query: string; page?: number; limit?: number; type?: 'patients' | 'operations' | 'doctors' | 'hospitals' | 'all'; dateFrom?: string; dateTo?: string; }
