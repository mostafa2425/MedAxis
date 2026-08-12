import { z } from 'zod';

export const createOperationSchema = z.object({
  name: z.string().min(1, 'Operation name is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  hospitalId: z.string().uuid('Invalid hospital ID'),
  operationDate: z.string().min(1, 'Operation date is required'),
  operationTime: z.string().min(1, 'Operation time is required'),
  operationRoom: z.string().optional(),
  duration: z.coerce.number().int().positive().optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
  patientId: z.string().uuid('Invalid patient ID'),
  specialtyId: z.string().uuid('Invalid specialty ID').optional(),
  medicalTeam: z.object({
    primarySurgeonId: z.string().uuid().optional(),
    assistantSurgeonId: z.string().uuid().optional(),
    anesthesiologistId: z.string().uuid().optional(),
    assistantAnesthesiaId: z.string().uuid().optional(),
    nurse: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  cost: z.object({
    totalCost: z.coerce.number().min(0),
    paidAmount: z.coerce.number().min(0).optional(),
    remainingAmount: z.coerce.number().min(0).optional(),
    paymentMethod: z.enum(['CASH', 'CARD', 'INSURANCE', 'BANK_TRANSFER', 'OTHER']).optional(),
    paymentStatus: z.enum(['PAID', 'UNPAID', 'PARTIAL']).optional(),
    paymentNotes: z.string().optional(),
  }).optional(),
});

export const updateOperationSchema = createOperationSchema.partial();

export const updateCostSchema = z.object({
  totalCost: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).optional(),
  remainingAmount: z.coerce.number().min(0).optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'INSURANCE', 'BANK_TRANSFER', 'OTHER']).optional(),
  paymentStatus: z.enum(['PAID', 'UNPAID', 'PARTIAL']).optional(),
  paymentNotes: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
});

export const operationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  specialtyId: z.string().uuid().optional(),
  hospitalId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['operationDate', 'createdAt', 'name', 'duration']).default('operationDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateOperationInput = z.infer<typeof createOperationSchema>;
export type UpdateOperationInput = z.infer<typeof updateOperationSchema>;
export type UpdateCostInput = z.infer<typeof updateCostSchema>;
export type OperationQueryInput = z.infer<typeof operationQuerySchema>;
