import { z } from 'zod';

const uuidString = z.string().uuid();

function parseIdList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : value.split(',');
  return [...new Set(raw.map((item) => item.trim()).filter(Boolean))];
}

export const createSpecialtySchema = z.object({
  name: z.string().min(1, 'Specialty name is required'),
  nameAr: z.string().optional(),
  icon: z.string().optional(),
});

export const updateSpecialtySchema = createSpecialtySchema.partial();

export const listSpecialtyQuerySchema = z.object({
  parentId: uuidString.optional(),
  parentIds: z.union([z.string(), z.array(z.string())]).optional(),
  mine: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((value) => value === true || value === 'true'),
  rootsOnly: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .optional()
    .transform((value) => value === true || value === 'true'),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
}).transform((query) => {
  const fromList = parseIdList(query.parentIds);
  const parentIds = query.parentId ? [...new Set([query.parentId, ...fromList])] : fromList;
  return {
    parentIds,
    mine: Boolean(query.mine),
    rootsOnly: Boolean(query.rootsOnly),
    search: query.search?.trim() || undefined,
    page: query.page,
    limit: query.limit,
  };
});

export type CreateSpecialtyInput = z.infer<typeof createSpecialtySchema>;
export type UpdateSpecialtyInput = z.infer<typeof updateSpecialtySchema>;
export type ListSpecialtyQuery = z.output<typeof listSpecialtyQuerySchema>;
