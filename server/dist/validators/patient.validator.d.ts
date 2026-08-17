import { z } from 'zod';
export declare const createPatientSchema: z.ZodObject<{
    fullName: z.ZodString;
    age: z.ZodCoercedNumber<unknown>;
    gender: z.ZodDefault<z.ZodEnum<{
        FEMALE: "FEMALE";
        MALE: "MALE";
    }>>;
    mobile: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updatePatientSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    age: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    gender: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        FEMALE: "FEMALE";
        MALE: "MALE";
    }>>>;
    mobile: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const patientQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        FEMALE: "FEMALE";
        MALE: "MALE";
    }>>;
}, z.core.$strip>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type PatientQueryInput = z.infer<typeof patientQuerySchema>;
//# sourceMappingURL=patient.validator.d.ts.map