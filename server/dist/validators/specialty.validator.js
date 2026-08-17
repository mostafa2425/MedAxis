"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSpecialtyQuerySchema = exports.updateSpecialtySchema = exports.createSpecialtySchema = void 0;
const zod_1 = require("zod");
const uuidString = zod_1.z.string().uuid();
function parseIdList(value) {
    if (!value)
        return [];
    const raw = Array.isArray(value) ? value : value.split(',');
    return [...new Set(raw.map((item) => item.trim()).filter(Boolean))];
}
exports.createSpecialtySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Specialty name is required'),
    nameAr: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
exports.updateSpecialtySchema = exports.createSpecialtySchema.partial();
exports.listSpecialtyQuerySchema = zod_1.z.object({
    parentId: uuidString.optional(),
    parentIds: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    mine: zod_1.z
        .union([zod_1.z.literal('true'), zod_1.z.literal('false'), zod_1.z.boolean()])
        .optional()
        .transform((value) => value === true || value === 'true'),
    rootsOnly: zod_1.z
        .union([zod_1.z.literal('true'), zod_1.z.literal('false'), zod_1.z.boolean()])
        .optional()
        .transform((value) => value === true || value === 'true'),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(200).optional(),
}).transform((query) => {
    const fromList = parseIdList(query.parentIds);
    const parentIds = query.parentId ? [...new Set([query.parentId, ...fromList])] : fromList;
    return {
        parentIds,
        mine: Boolean(query.mine),
        rootsOnly: Boolean(query.rootsOnly),
        search: query.search?.trim() || undefined,
        page: query.page,
        limit: query.limit,
    };
});
//# sourceMappingURL=specialty.validator.js.map