"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorQuerySchema = exports.updateDoctorSchema = exports.createDoctorSchema = void 0;
const zod_1 = require("zod");
const uuidString = zod_1.z.string().uuid();
const doctorBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Doctor name is required'),
    phone: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
    email: zod_1.z.union([zod_1.z.string().email('Invalid email'), zod_1.z.literal('')]).optional(),
    specialtyIds: zod_1.z.array(uuidString).optional(),
    specialtyId: uuidString.optional(),
    subspecialtyIds: zod_1.z.array(uuidString).optional(),
});
function resolvePhone(phone, mobile) {
    const value = (phone ?? mobile)?.trim();
    return value ? value : undefined;
}
function resolveSpecialtyIds(specialtyIds, specialtyId) {
    if (specialtyIds !== undefined)
        return [...new Set(specialtyIds)];
    if (specialtyId !== undefined)
        return [specialtyId];
    return undefined;
}
exports.createDoctorSchema = doctorBodySchema
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
exports.updateDoctorSchema = doctorBodySchema.partial().transform((data) => {
    const result = {};
    if (data.name !== undefined)
        result.name = data.name.trim();
    if (data.phone !== undefined || data.mobile !== undefined) {
        result.phone = resolvePhone(data.phone, data.mobile) ?? null;
    }
    if (data.email !== undefined) {
        result.email = data.email.trim() || null;
    }
    const specialtyIds = resolveSpecialtyIds(data.specialtyIds, data.specialtyId);
    if (specialtyIds !== undefined)
        result.specialtyIds = specialtyIds;
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
exports.doctorQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    search: zod_1.z.string().optional(),
    specialtyId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=doctor.validator.js.map