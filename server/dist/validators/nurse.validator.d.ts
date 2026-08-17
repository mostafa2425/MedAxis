import { z } from 'zod';
export declare const createNurseSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
}, z.core.$strip>, z.ZodTransform<{
    name: string;
    phone: string | undefined;
    email: string | undefined;
}, {
    name: string;
    phone?: string | undefined;
    email?: string | undefined;
}>>;
export declare const updateNurseSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
}, z.core.$strip>, z.ZodTransform<{
    name?: string | undefined;
    phone?: string | null | undefined;
    email?: string | null | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
}>>;
export declare const nurseQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateNurseInput = z.infer<typeof createNurseSchema>;
export type UpdateNurseInput = z.infer<typeof updateNurseSchema>;
//# sourceMappingURL=nurse.validator.d.ts.map