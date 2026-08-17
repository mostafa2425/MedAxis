"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationQuerySchema = exports.updateStatusSchema = exports.updateCostSchema = exports.updateOperationSchema = exports.createOperationSchema = void 0;
const zod_1 = require("zod");
const optionalText = zod_1.z.string().nullish().transform((value) => {
    if (value == null)
        return value;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
});
const dateString = zod_1.z.string().min(1, 'Operation date is required').refine((value) => !Number.isNaN(Date.parse(value)), { message: 'Invalid date' });
const timeString = zod_1.z.string().min(1, 'Operation time is required').refine((value) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(value), { message: 'Invalid time' });
const costSchema = zod_1.z.object({
    totalCost: zod_1.z.coerce.number().min(0),
    paidAmount: zod_1.z.coerce.number().min(0).optional(),
    remainingAmount: zod_1.z.coerce.number().min(0).optional(),
    hospitalCost: zod_1.z.coerce.number().min(0).default(0),
    nursingCost: zod_1.z.coerce.number().min(0).default(0),
    assistantDoctorsCost: zod_1.z.coerce.number().min(0).default(0),
    equipmentCost: zod_1.z.coerce.number().min(0).default(0),
    otherCost: zod_1.z.coerce.number().min(0).default(0),
    paymentMethod: zod_1.z.enum(['CASH', 'CARD', 'INSURANCE', 'BANK_TRANSFER', 'OTHER']).optional(),
    paymentStatus: zod_1.z.enum(['PAID', 'UNPAID', 'PARTIAL']).optional(),
    paymentNotes: zod_1.z.string().optional(),
}).superRefine((data, ctx) => {
    const paid = data.paidAmount ?? 0;
    if (paid > data.totalCost)
        ctx.addIssue({ code: 'custom', path: ['paidAmount'], message: 'Paid amount cannot exceed total amount' });
    const breakdown = data.hospitalCost + data.nursingCost + data.assistantDoctorsCost + data.equipmentCost + data.otherCost;
    if (breakdown > data.totalCost)
        ctx.addIssue({ code: 'custom', path: ['totalCost'], message: 'Cost breakdown cannot exceed total operation cost' });
});
const operationBodySchema = zod_1.z.object({
    operationId: zod_1.z.string().uuid('Invalid operation ID').optional(),
    operationIds: zod_1.z.array(zod_1.z.string().uuid('Invalid operation ID')).min(1).optional(),
    name: zod_1.z.string().min(1, 'Operation name is required').optional(),
    diagnosis: optionalText,
    hospitalId: zod_1.z.string().uuid('Invalid hospital ID'),
    operationDate: dateString,
    operationTime: timeString,
    operationRoom: zod_1.z.string().optional(),
    duration: zod_1.z.coerce.number().int().positive().optional(),
    status: zod_1.z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    notes: zod_1.z.string().optional(),
    patientId: zod_1.z.string().uuid('Invalid patient ID'),
    specialtyId: zod_1.z.string().uuid('Invalid specialty ID').optional(),
    medicalTeam: zod_1.z.object({
        doctorIds: zod_1.z.array(zod_1.z.string().uuid()).optional(), nurseIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
        primarySurgeonId: zod_1.z.string().uuid().optional(), assistantSurgeonId: zod_1.z.string().uuid().optional(),
        anesthesiologistId: zod_1.z.string().uuid().optional(), assistantAnesthesiaId: zod_1.z.string().uuid().optional(),
        nurse: zod_1.z.string().optional(), notes: zod_1.z.string().optional(),
    }).optional(),
    cost: costSchema.optional(),
});
exports.createOperationSchema = operationBodySchema.superRefine((data, ctx) => {
    const ids = [...(data.operationIds ?? []), data.operationId].filter(Boolean);
    if (ids.length === 0)
        ctx.addIssue({ code: 'custom', path: ['operationIds'], message: 'At least one operation is required' });
});
exports.updateOperationSchema = operationBodySchema.partial();
exports.updateCostSchema = costSchema;
exports.updateStatusSchema = zod_1.z.object({ status: zod_1.z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']) });
exports.operationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1), limit: zod_1.z.coerce.number().int().positive().max(100).default(20), search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(), specialtyId: zod_1.z.string().uuid().optional(), hospitalId: zod_1.z.string().uuid().optional(),
    dateFrom: zod_1.z.string().optional(), dateTo: zod_1.z.string().optional(), sortBy: zod_1.z.enum(['operationDate', 'createdAt', 'name', 'duration']).default('operationDate'), sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=surgery.validator.js.map