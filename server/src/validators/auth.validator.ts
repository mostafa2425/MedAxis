import { z } from 'zod';

const uuidString = z.string().uuid();

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  specialtyIds: z
    .array(uuidString)
    .min(1, 'Please select at least one specialty'),
  subspecialtyIds: z.array(uuidString).optional().default([]),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().nullish(),
  specialtyIds: z
    .array(uuidString)
    .min(1, 'Please select at least one specialty')
    .optional(),
  subspecialtyIds: z.array(uuidString).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
