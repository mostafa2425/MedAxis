"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const uuidString = zod_1.z.string().uuid();
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    phone: zod_1.z.string().optional(),
    specialtyIds: zod_1.z
        .array(uuidString)
        .min(1, 'Please select at least one specialty'),
    subspecialtyIds: zod_1.z.array(uuidString).optional().default([]),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: zod_1.z.string().nullish(),
    specialtyIds: zod_1.z
        .array(uuidString)
        .min(1, 'Please select at least one specialty')
        .optional(),
    subspecialtyIds: zod_1.z.array(uuidString).optional(),
});
//# sourceMappingURL=auth.validator.js.map