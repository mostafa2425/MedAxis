import { z } from 'zod';
export declare const createDoctorSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    mobile: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
    specialtyIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    specialtyId: z.ZodOptional<z.ZodString>;
    subspecialtyIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodTransform<{
    name: string;
    phone: string | undefined;
    email: string | undefined;
    specialtyIds: string[];
    subspecialtyIds: string[];
}, {
    name: string;
    phone?: string | undefined;
    mobile?: string | undefined;
    email?: string | undefined;
    specialtyIds?: string[] | undefined;
    specialtyId?: string | undefined;
    subspecialtyIds?: string[] | undefined;
}>>;
export declare const updateDoctorSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    mobile: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    specialtyIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    specialtyId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    subspecialtyIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>, z.ZodTransform<{
    name?: string;
    phone?: string | null;
    email?: string | null;
    specialtyIds?: string[];
    subspecialtyIds?: string[];
}, {
    name?: string | undefined;
    phone?: string | undefined;
    mobile?: string | undefined;
    email?: string | undefined;
    specialtyIds?: string[] | undefined;
    specialtyId?: string | undefined;
    subspecialtyIds?: string[] | undefined;
}>>;
export declare const doctorQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    specialtyId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type DoctorQueryInput = z.infer<typeof doctorQuerySchema>;
//# sourceMappingURL=doctor.validator.d.ts.map