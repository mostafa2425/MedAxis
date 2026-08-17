"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadOperationFiles = exports.uploadSingle = exports.uploadMultiple = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const allowedMimes = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/dicom',
    'application/octet-stream',
]);
// Vercel Functions reject request bodies above 4.5MB. Large medical files
// should use the signed-upload flow instead of multipart upload through Vercel.
const maxMultipartSize = process.env.VERCEL
    ? 4 * 1024 * 1024
    : 50 * 1024 * 1024;
const fileFilter = (_req, file, cb) => {
    if (!allowedMimes.has(file.mimetype)) {
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
        return;
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: maxMultipartSize,
        files: 20,
    },
});
exports.uploadMultiple = exports.upload.array('files', 20);
exports.uploadSingle = exports.upload.single('file');
exports.uploadOperationFiles = exports.upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'files', maxCount: 20 },
]);
//# sourceMappingURL=upload.js.map