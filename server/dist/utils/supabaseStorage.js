"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperationStoragePath = createOperationStoragePath;
exports.validateFileMetadata = validateFileMetadata;
exports.uploadOperationFile = uploadOperationFile;
exports.createSignedUploadUrl = createSignedUploadUrl;
exports.assertStoredFileExists = assertStoredFileExists;
exports.createSignedDownloadUrl = createSignedDownloadUrl;
exports.deleteStoredFile = deleteStoredFile;
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const errors_1 = require("./errors");
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const SIGNED_UPLOAD_EXPIRY_SECONDS = 60 * 60 * 2;
const SIGNED_DOWNLOAD_EXPIRY_SECONDS = 60 * 10;
function getConfig() {
    const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'medaxis-files';
    if (!baseUrl || !serviceRoleKey) {
        throw new errors_1.AppError('Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.', 500);
    }
    return { baseUrl, serviceRoleKey, bucket };
}
function encodeStoragePath(value) {
    return value
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join('/');
}
async function storageRequest(endpoint, init = {}) {
    const { baseUrl, serviceRoleKey } = getConfig();
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${serviceRoleKey}`);
    headers.set('apikey', serviceRoleKey);
    if (!headers.has('Content-Type'))
        headers.set('Content-Type', 'application/json');
    const response = await fetch(`${baseUrl}/storage/v1${endpoint}`, {
        ...init,
        headers,
    });
    if (!response.ok) {
        const text = await response.text();
        console.error('Supabase Storage request failed:', response.status, text);
        throw new errors_1.AppError('File storage operation failed', 502);
    }
    if (response.status === 204)
        return undefined;
    return (await response.json());
}
function sanitizeFileName(fileName) {
    const ext = path_1.default.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, '');
    const base = path_1.default.basename(fileName, path_1.default.extname(fileName))
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'file';
    return `${base}${ext}`;
}
function createOperationStoragePath(operationId, fileName) {
    return `operations/${operationId}/${crypto_1.default.randomUUID()}-${sanitizeFileName(fileName)}`;
}
function validateFileMetadata(fileName, mimeType, fileSize) {
    if (!fileName?.trim()) {
        throw new errors_1.AppError('File name is required', 400, [
            { path: ['fileName'], code: 'custom', message: 'File name is required' },
        ]);
    }
    if (!Number.isFinite(fileSize) || fileSize <= 0) {
        throw new errors_1.AppError('File size must be greater than zero', 400, [
            { path: ['fileSize'], code: 'custom', message: 'File size must be greater than zero' },
        ]);
    }
    if (fileSize > MAX_FILE_SIZE) {
        throw new errors_1.AppError('File too large. Maximum size is 50MB', 400, [
            { path: ['fileSize'], code: 'custom', message: 'Maximum file size is 50MB' },
        ]);
    }
    const allowedMimes = new Set([
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/dicom',
        'application/octet-stream',
    ]);
    if (!allowedMimes.has(mimeType)) {
        throw new errors_1.AppError(`Unsupported file type: ${mimeType}`, 400, [
            { path: ['mimeType'], code: 'custom', message: `Unsupported file type: ${mimeType}` },
        ]);
    }
}
async function uploadOperationFile(storagePath, file) {
    validateFileMetadata(storagePath, file.mimetype, file.size);
    const { bucket } = getConfig();
    const encodedPath = encodeStoragePath(storagePath);
    await storageRequest(`/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
        method: 'POST',
        headers: {
            'Content-Type': file.mimetype || 'application/octet-stream',
            'x-upsert': 'false',
            'cache-control': '3600',
        },
        body: file.buffer,
    });
    return storagePath;
}
async function createSignedUploadUrl(storagePath, mimeType, fileSize) {
    validateFileMetadata(storagePath, mimeType, fileSize);
    const { bucket, baseUrl } = getConfig();
    const encodedPath = encodeStoragePath(storagePath);
    const data = await storageRequest(`/object/upload/sign/${encodeURIComponent(bucket)}/${encodedPath}`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
    const signedUrl = new URL(data.url, `${baseUrl}/storage/v1`).toString();
    const token = new URL(signedUrl).searchParams.get('token');
    if (!token)
        throw new errors_1.AppError('Storage did not return an upload token', 502);
    return {
        path: storagePath,
        token,
        signedUrl,
        expiresIn: SIGNED_UPLOAD_EXPIRY_SECONDS,
    };
}
async function assertStoredFileExists(storagePath) {
    const { baseUrl, serviceRoleKey, bucket } = getConfig();
    const response = await fetch(`${baseUrl}/storage/v1/object/info/${encodeURIComponent(bucket)}/${encodeStoragePath(storagePath)}`, {
        method: 'HEAD',
        headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
        },
    });
    if (!response.ok) {
        throw new errors_1.AppError('Uploaded file was not found in storage', 400, [
            { path: ['filePath'], code: 'custom', message: 'Upload the file before completing the upload' },
        ]);
    }
}
async function createSignedDownloadUrl(storagePath) {
    const { bucket, baseUrl } = getConfig();
    const encodedPath = encodeStoragePath(storagePath);
    const data = await storageRequest(`/object/sign/${encodeURIComponent(bucket)}/${encodedPath}`, {
        method: 'POST',
        body: JSON.stringify({ expiresIn: SIGNED_DOWNLOAD_EXPIRY_SECONDS }),
    });
    return {
        url: new URL(data.signedURL, `${baseUrl}/storage/v1`).toString(),
        expiresIn: SIGNED_DOWNLOAD_EXPIRY_SECONDS,
    };
}
async function deleteStoredFile(storagePath) {
    const { bucket } = getConfig();
    await storageRequest(`/object/${encodeURIComponent(bucket)}`, {
        method: 'DELETE',
        body: JSON.stringify({ prefixes: [storagePath] }),
    });
}
//# sourceMappingURL=supabaseStorage.js.map