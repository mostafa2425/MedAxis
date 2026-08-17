"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nurseQuerySchema = exports.updateNurseSchema = exports.createNurseSchema = void 0;
const zod_1 = require("zod");
exports.createNurseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nurse name is required'),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.union([zod_1.z.string().email('Invalid email'), zod_1.z.literal('')]).optional(),
}).transform((data) => ({
    name: data.name.trim(),
    phone: data.phone?.trim() || undefined,
    email: data.email?.trim() || undefined,
}));
exports.updateNurseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.union([zod_1.z.string().email('Invalid email'), zod_1.z.literal('')]).optional(),
}).transform((data) => ({
    ...(data.name !== undefined ? { name: data.name.trim() } : {}),
    ...(data.phone !== undefined ? { phone: data.phone.trim() || null } : {}),
    ...(data.email !== undefined ? { email: data.email.trim() || null } : {}),
}));
exports.nurseQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=nurse.validator.js.map