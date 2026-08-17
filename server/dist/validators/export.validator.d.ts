import { z } from 'zod';
export declare const exportQuerySchema: z.ZodObject<{
    format: z.ZodDefault<z.ZodEnum<{
        csv: "csv";
        json: "json";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        SCHEDULED: "SCHEDULED";
    }>>;
    specialtyId: z.ZodOptional<z.ZodString>;
    hospitalId: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ExportQueryInput = z.infer<typeof exportQuerySchema>;
//# sourceMappingURL=export.validator.d.ts.map