"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeUploadSchema = exports.createUploadUrlSchema = void 0;
const zod_1 = require("zod");
const fileType = zod_1.z.enum([
    'BEFORE_IMAGE',
    'BEFORE_XRAY',
    'BEFORE_MRI',
    'BEFORE_CT',
    'BEFORE_LAB',
    'BEFORE_PDF',
    'AFTER_IMAGE',
    'AFTER_REPORT',
    'AFTER_PDF',
    'AFTER_OTHER',
]);
exports.createUploadUrlSchema = zod_1.z.object({
    fileName: zod_1.z.string().trim().min(1, 'File name is required'),
    mimeType: zod_1.z.string().trim().min(1, 'MIME type is required'),
    fileSize: zod_1.z.coerce.number().int().positive('File size must be greater than zero'),
    fileType,
});
exports.completeUploadSchema = exports.createUploadUrlSchema.extend({
    filePath: zod_1.z.string().trim().min(1, 'File path is required'),
});
//# sourceMappingURL=fileUpload.validator.js.map