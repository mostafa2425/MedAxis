import { z } from 'zod';

export const createHospitalSchema = z.object({
  name: z.string().min(1, 'Hospital name is required'),
  nameAr: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  governorateId: z.string().uuid().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const updateHospitalSchema = createHospitalSchema.partial();

export const hospitalQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  governorateId: z.string().uuid().optional(),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof updateHospitalSchema>;
export type HospitalQueryInput = z.infer<typeof hospitalQuerySchema>;
