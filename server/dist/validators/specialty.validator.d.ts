import { z } from 'zod';
export declare const createSpecialtySchema: z.ZodObject<{
    name: z.ZodString;
    nameAr: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateSpecialtySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    nameAr: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const listSpecialtyQuerySchema: z.ZodPipe<z.ZodObject<{
    parentId: z.ZodOptional<z.ZodString>;
    parentIds: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
    mine: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"true">, z.ZodLiteral<"false">, z.ZodBoolean]>>, z.ZodTransform<boolean, "false" | "true" | boolean | undefined>>;
    rootsOnly: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"true">, z.ZodLiteral<"false">, z.ZodBoolean]>>, z.ZodTransform<boolean, "false" | "true" | boolean | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, z.ZodTransform<{
    parentIds: string[];
    mine: boolean;
    rootsOnly: boolean;
    search: string | undefined;
    page: number | undefined;
    limit: number | undefined;
}, {
    parentId?: string | undefined;
    parentIds?: string | string[] | undefined;
    mine: boolean;
    rootsOnly: boolean;
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>>;
export type CreateSpecialtyInput = z.infer<typeof createSpecialtySchema>;
export type UpdateSpecialtyInput = z.infer<typeof updateSpecialtySchema>;
export type ListSpecialtyQuery = z.output<typeof listSpecialtyQuerySchema>;
//# sourceMappingURL=specialty.validator.d.ts.map