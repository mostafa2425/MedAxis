import { z } from 'zod';
export declare const createHospitalSchema: z.ZodObject<{
    name: z.ZodString;
    nameAr: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    governorateId: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateHospitalSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    nameAr: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    governorateId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const hospitalQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    governorateId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof updateHospitalSchema>;
export type HospitalQueryInput = z.infer<typeof hospitalQuerySchema>;
//# sourceMappingURL=hospital.validator.d.ts.map