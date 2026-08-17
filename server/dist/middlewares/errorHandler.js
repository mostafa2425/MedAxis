"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const prisma_1 = require("../prisma");
const zod_1 = require("zod");
const multer_1 = require("multer");
const validationErrors_1 = require("../utils/validationErrors");
const VALIDATION_FAILED = 'Validation failed';
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        return (0, response_1.sendError)(res, VALIDATION_FAILED, 400, (0, validationErrors_1.normalizeZodIssues)(err.issues) ?? []);
    }
    if (err instanceof errors_1.AppError) {
        const normalized = (0, validationErrors_1.normalizeZodIssues)(err.details);
        if (normalized)
            return (0, response_1.sendError)(res, VALIDATION_FAILED, err.statusCode, normalized);
        return (0, response_1.sendError)(res, err.message, err.statusCode, err.details);
    }
    if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const target = err.meta?.target?.join(', ') || 'field';
            return (0, response_1.sendError)(res, `Duplicate value for: ${target}`, 409);
        }
        if (err.code === 'P2025')
            return (0, response_1.sendError)(res, 'Record not found', 404);
        if (err.code === 'P2003')
            return (0, response_1.sendError)(res, 'Related record not found', 400);
    }
    if (err instanceof prisma_1.Prisma.PrismaClientValidationError) {
        console.error('Prisma validation error:', err.message);
        return (0, response_1.sendError)(res, 'Invalid request data', 400, [{ path: [], code: 'custom', message: 'Invalid request data' }]);
    }
    if (err instanceof multer_1.MulterError)
        return (0, response_1.sendError)(res, err.message, 400, [{ path: ['file'], code: 'custom', message: err.message }]);
    if (err instanceof SyntaxError)
        return (0, response_1.sendError)(res, 'Invalid JSON in request body', 400);
    console.error('Unhandled error:', err);
    return (0, response_1.sendError)(res, 'Internal server error', 500);
}
//# sourceMappingURL=errorHandler.js.map