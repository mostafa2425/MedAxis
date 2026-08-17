"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalQuerySchema = exports.updateHospitalSchema = exports.createHospitalSchema = void 0;
const zod_1 = require("zod");
exports.createHospitalSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Hospital name is required'),
    nameAr: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    governorateId: zod_1.z.string().uuid().optional(),
    phone: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateHospitalSchema = exports.createHospitalSchema.partial();
exports.hospitalQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    search: zod_1.z.string().optional(),
    governorateId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=hospital.validator.js.map