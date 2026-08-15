import { z } from 'zod';

export const createCatalogItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Operation name is required')
    .max(150, 'Operation name is too long'),
});

export type CreateCatalogItemInput = z.infer<typeof createCatalogItemSchema>;
