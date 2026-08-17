"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveFileType = resolveFileType;
const prisma_1 = require("../prisma");
const errors_1 = require("./errors");
const ALIASES = {
    BEFORE_OPERATION: prisma_1.FileType.BEFORE_IMAGE,
    AFTER_OPERATION: prisma_1.FileType.AFTER_IMAGE,
};
const ALLOWED = new Set(Object.values(prisma_1.FileType));
function resolveFileType(input) {
    const raw = (input || prisma_1.FileType.BEFORE_IMAGE).trim().toUpperCase();
    const mapped = ALIASES[raw] ?? raw;
    if (!ALLOWED.has(mapped)) {
        throw new errors_1.BadRequestError('Invalid file type', [
            { path: ['fileType'], code: 'custom', message: `Invalid file type. Allowed: ${[...ALLOWED].join(', ')} (aliases: BEFORE_OPERATION, AFTER_OPERATION)` },
        ]);
    }
    return mapped;
}
//# sourceMappingURL=fileType.js.map