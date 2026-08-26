import { z } from 'zod';

const optionalText = z.string().nullish().transform((value) => {
  if (value == null) return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
});

const dateString = z.string().min(1, 'Operation date is required').refine((value) => !Number.isNaN(Date.parse(value)), { message: 'Invalid date' });
const timeString = z.string().min(1, 'Operation time is required').refine((value) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(value), { message: 'Invalid time' });

const costSchema = z.object({
  totalCost: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).optional(),
  remainingAmount: z.coerce.number().min(0).optional(),
  hospitalCost: z.coerce.number().min(0).default(0),
  nursingCost: z.coerce.number().min(0).default(0),
  assistantDoctorsCost: z.coerce.number().min(0).default(0),
  equipmentCost: z.coerce.number().min(0).default(0),
  otherCost: z.coerce.number().min(0).default(0),
  paymentMethod: z.enum(['CASH', 'CARD', 'INSURANCE', 'BANK_TRANSFER', 'OTHER']).optional(),
  paymentStatus: z.enum(['PAID', 'UNPAID', 'PARTIAL']).optional(),
  paymentNotes: z.string().optional(),
}).superRefine((data, ctx) => {
  const paid = data.paidAmount ?? 0;
  if (paid > data.totalCost) ctx.addIssue({ code: 'custom', path: ['paidAmount'], message: 'Paid amount cannot exceed total amount' });
  const breakdown = data.hospitalCost + data.nursingCost + data.assistantDoctorsCost + data.equipmentCost + data.otherCost;
  if (breakdown > data.totalCost) ctx.addIssue({ code: 'custom', path: ['totalCost'], message: 'Cost breakdown cannot exceed total operation cost' });
});

const operationBodySchema = z.object({
  operationId: z.string().uuid('Invalid operation ID').optional(),
  operationIds: z.array(z.string().uuid('Invalid operation ID')).min(1).optional(),
  name: z.string().min(1, 'Operation name is required').optional(),
  diagnosis: optionalText,
  hospitalId: z.string().uuid('Invalid hospital ID'),
  operationDate: dateString,
  operationTime: timeString,
  operationRoom: z.string().optional(),
  duration: z.coerce.number().int().positive().optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
  patientId: z.string().uuid('Invalid patient ID'),
  specialtyId: z.string().uuid('Invalid specialty ID').optional(),
  medicalTeam: z.object({
    doctorIds: z.array(z.string().uuid()).optional(), nurseIds: z.array(z.string().uuid()).optional(),
    primarySurgeonId: z.string().uuid().optional(), assistantSurgeonId: z.string().uuid().optional(),
    anesthesiologistId: z.string().uuid().optional(), assistantAnesthesiaId: z.string().uuid().optional(),
    nurse: z.string().optional(), notes: z.string().optional(),
  }).optional(),
  cost: costSchema.optional(),
});

export const createOperationSchema = operationBodySchema.superRefine((data, ctx) => {
  const ids = [...(data.operationIds ?? []), data.operationId].filter(Boolean);
  if (ids.length === 0) ctx.addIssue({ code: 'custom', path: ['operationIds'], message: 'At least one operation is required' });
});
export const updateOperationSchema = operationBodySchema.partial();
export const updateCostSchema = costSchema;
export const updateStatusSchema = z.object({ status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']) });
export const operationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().positive().max(100).default(20), search: z.string().optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(), specialtyId: z.string().uuid().optional(), hospitalId: z.string().uuid().optional(), surgicalProcedureId: z.string().uuid().optional(),
  dateFrom: z.string().optional(), dateTo: z.string().optional(), sortBy: z.enum(['operationDate', 'createdAt', 'name', 'duration']).default('operationDate'), sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type CreateOperationInput = z.infer<typeof createOperationSchema>;
export type UpdateOperationInput = z.infer<typeof updateOperationSchema>;
export type UpdateCostInput = z.infer<typeof updateCostSchema>;
export type OperationQueryInput = z.infer<typeof operationQuerySchema>;
