import { z } from 'zod';

export const createSpecialtySchema = z.object({
  name: z.string().min(1, 'Specialty name is required'),
  nameAr: z.string().optional(),
  icon: z.string().optional(),
});

export const updateSpecialtySchema = createSpecialtySchema.partial();

export type CreateSpecialtyInput = z.infer<typeof createSpecialtySchema>;
export type UpdateSpecialtyInput = z.infer<typeof updateSpecialtySchema>;
