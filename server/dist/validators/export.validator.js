"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportQuerySchema = void 0;
const zod_1 = require("zod");
exports.exportQuerySchema = zod_1.z.object({
    format: zod_1.z.enum(['json', 'csv']).default('json'),
    status: zod_1.z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    specialtyId: zod_1.z.string().uuid().optional(),
    hospitalId: zod_1.z.string().uuid().optional(),
    dateFrom: zod_1.z.string().optional(),
    dateTo: zod_1.z.string().optional(),
});
//# sourceMappingURL=export.validator.js.map