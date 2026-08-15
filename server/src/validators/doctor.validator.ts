import { z } from 'zod';

const uuidString = z.string().uuid();

const doctorBodySchema = z.object({
  name: z.string().min(1, 'Doctor name is required'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
  specialtyIds: z.array(uuidString).optional(),
  specialtyId: uuidString.optional(),
  subspecialtyIds: z.array(uuidString).optional(),
});

function resolvePhone(phone?: string, mobile?: string): string | undefined {
  const value = (phone ?? mobile)?.trim();
  return value ? value : undefined;
}

function resolveSpecialtyIds(
  specialtyIds?: string[],
  specialtyId?: string,
): string[] | undefined {
  if (specialtyIds !== undefined) return [...new Set(specialtyIds)];
  if (specialtyId !== undefined) return [specialtyId];
  return undefined;
}

export const createDoctorSchema = doctorBodySchema
  .transform((data) => ({
    name: data.name.trim(),
    phone: resolvePhone(data.phone, data.mobile),
    email: data.email?.trim() || undefined,
    specialtyIds: resolveSpecialtyIds(data.specialtyIds, data.specialtyId) ?? [],
    subspecialtyIds: data.subspecialtyIds ? [...new Set(data.subspecialtyIds)] : [],
  }))
  .superRefine((data, ctx) => {
    if (data.specialtyIds.length < 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['specialtyIds'],
        message: 'Please select at least one specialty',
      });
    }
  });

export const updateDoctorSchema = doctorBodySchema.partial().transform((data) => {
  const result: {
    name?: string;
    phone?: string | null;
    email?: string | null;
    specialtyIds?: string[];
    subspecialtyIds?: string[];
  } = {};

  if (data.name !== undefined) result.name = data.name.trim();
  if (data.phone !== undefined || data.mobile !== undefined) {
    result.phone = resolvePhone(data.phone, data.mobile) ?? null;
  }
  if (data.email !== undefined) {
    result.email = data.email.trim() || null;
  }
  const specialtyIds = resolveSpecialtyIds(data.specialtyIds, data.specialtyId);
  if (specialtyIds !== undefined) result.specialtyIds = specialtyIds;
  if (data.subspecialtyIds !== undefined) {
    result.subspecialtyIds = [...new Set(data.subspecialtyIds)];
  }

  return result;
}).superRefine((data, ctx) => {
  if (data.specialtyIds !== undefined && data.specialtyIds.length < 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['specialtyIds'],
      message: 'Please select at least one specialty',
    });
  }
});

export const doctorQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  specialtyId: z.string().uuid().optional(),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type DoctorQueryInput = z.infer<typeof doctorQuerySchema>;
