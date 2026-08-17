"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientQuerySchema = exports.updatePatientSchema = exports.createPatientSchema = void 0;
const zod_1 = require("zod");
exports.createPatientSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, 'Full name is required'),
    age: zod_1.z.coerce.number().int().positive().max(150, 'Age must be between 1 and 150'),
    gender: zod_1.z.enum(['MALE', 'FEMALE']).default('MALE'),
    mobile: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updatePatientSchema = exports.createPatientSchema.partial();
exports.patientQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    search: zod_1.z.string().optional(),
    gender: zod_1.z.enum(['MALE', 'FEMALE']).optional(),
});
//# sourceMappingURL=patient.validator.js.map