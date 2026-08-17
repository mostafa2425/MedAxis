"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCatalogItemSchema = void 0;
const zod_1 = require("zod");
exports.createCatalogItemSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Operation name is required')
        .max(150, 'Operation name is too long'),
});
//# sourceMappingURL=operationCatalog.validator.js.map