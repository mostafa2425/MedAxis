import { z } from 'zod';

export const createNurseSchema = z.object({
  name: z.string().min(1, 'Nurse name is required'),
  phone: z.string().optional(),
  email: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
}).transform((data) => ({
  name: data.name.trim(),
  phone: data.phone?.trim() || undefined,
  email: data.email?.trim() || undefined,
}));

export const updateNurseSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  email: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
}).transform((data) => ({
  ...(data.name !== undefined ? { name: data.name.trim() } : {}),
  ...(data.phone !== undefined ? { phone: data.phone.trim() || null } : {}),
  ...(data.email !== undefined ? { email: data.email.trim() || null } : {}),
}));

export const nurseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type CreateNurseInput = z.infer<typeof createNurseSchema>;
export type UpdateNurseInput = z.infer<typeof updateNurseSchema>;
