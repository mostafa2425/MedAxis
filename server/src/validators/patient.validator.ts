import { z } from 'zod';

export const createPatientSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  age: z.coerce.number().int().positive().max(150, 'Age must be between 1 and 150'),
  gender: z.enum(['MALE', 'FEMALE']).default('MALE'),
  mobile: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const patientQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  surgicalProcedureId: z.string().uuid().optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type PatientQueryInput = z.infer<typeof patientQuerySchema>;
