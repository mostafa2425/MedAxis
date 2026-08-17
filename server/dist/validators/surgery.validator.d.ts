import { z } from 'zod';
export declare const createOperationSchema: z.ZodObject<{
    operationId: z.ZodOptional<z.ZodString>;
    operationIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    diagnosis: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null | undefined, string | null | undefined>>;
    hospitalId: z.ZodString;
    operationDate: z.ZodString;
    operationTime: z.ZodString;
    operationRoom: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        SCHEDULED: "SCHEDULED";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
    patientId: z.ZodString;
    specialtyId: z.ZodOptional<z.ZodString>;
    medicalTeam: z.ZodOptional<z.ZodObject<{
        doctorIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        nurseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        primarySurgeonId: z.ZodOptional<z.ZodString>;
        assistantSurgeonId: z.ZodOptional<z.ZodString>;
        anesthesiologistId: z.ZodOptional<z.ZodString>;
        assistantAnesthesiaId: z.ZodOptional<z.ZodString>;
        nurse: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    cost: z.ZodOptional<z.ZodObject<{
        totalCost: z.ZodCoercedNumber<unknown>;
        paidAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        remainingAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        paymentMethod: z.ZodOptional<z.ZodEnum<{
            BANK_TRANSFER: "BANK_TRANSFER";
            CARD: "CARD";
            CASH: "CASH";
            INSURANCE: "INSURANCE";
            OTHER: "OTHER";
        }>>;
        paymentStatus: z.ZodOptional<z.ZodEnum<{
            PAID: "PAID";
            PARTIAL: "PARTIAL";
            UNPAID: "UNPAID";
        }>>;
        paymentNotes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateOperationSchema: z.ZodObject<{
    operationId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    operationIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    diagnosis: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null | undefined, string | null | undefined>>>;
    hospitalId: z.ZodOptional<z.ZodString>;
    operationDate: z.ZodOptional<z.ZodString>;
    operationTime: z.ZodOptional<z.ZodString>;
    operationRoom: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    duration: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        SCHEDULED: "SCHEDULED";
    }>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    patientId: z.ZodOptional<z.ZodString>;
    specialtyId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    medicalTeam: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        doctorIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        nurseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        primarySurgeonId: z.ZodOptional<z.ZodString>;
        assistantSurgeonId: z.ZodOptional<z.ZodString>;
        anesthesiologistId: z.ZodOptional<z.ZodString>;
        assistantAnesthesiaId: z.ZodOptional<z.ZodString>;
        nurse: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    cost: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        totalCost: z.ZodCoercedNumber<unknown>;
        paidAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        remainingAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        paymentMethod: z.ZodOptional<z.ZodEnum<{
            BANK_TRANSFER: "BANK_TRANSFER";
            CARD: "CARD";
            CASH: "CASH";
            INSURANCE: "INSURANCE";
            OTHER: "OTHER";
        }>>;
        paymentStatus: z.ZodOptional<z.ZodEnum<{
            PAID: "PAID";
            PARTIAL: "PARTIAL";
            UNPAID: "UNPAID";
        }>>;
        paymentNotes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateCostSchema: z.ZodObject<{
    totalCost: z.ZodCoercedNumber<unknown>;
    paidAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    remainingAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    paymentMethod: z.ZodOptional<z.ZodEnum<{
        BANK_TRANSFER: "BANK_TRANSFER";
        CARD: "CARD";
        CASH: "CASH";
        INSURANCE: "INSURANCE";
        OTHER: "OTHER";
    }>>;
    paymentStatus: z.ZodOptional<z.ZodEnum<{
        PAID: "PAID";
        PARTIAL: "PARTIAL";
        UNPAID: "UNPAID";
    }>>;
    paymentNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        SCHEDULED: "SCHEDULED";
    }>;
}, z.core.$strip>;
export declare const operationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
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
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        duration: "duration";
        name: "name";
        operationDate: "operationDate";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateOperationInput = z.infer<typeof createOperationSchema>;
export type UpdateOperationInput = z.infer<typeof updateOperationSchema>;
export type UpdateCostInput = z.infer<typeof updateCostSchema>;
export type OperationQueryInput = z.infer<typeof operationQuerySchema>;
//# sourceMappingURL=surgery.validator.d.ts.map