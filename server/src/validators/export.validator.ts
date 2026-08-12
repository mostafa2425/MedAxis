import { z } from 'zod';

export const exportQuerySchema = z.object({
  format: z.enum(['json', 'csv']).default('json'),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  specialtyId: z.string().uuid().optional(),
  hospitalId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type ExportQueryInput = z.infer<typeof exportQuerySchema>;