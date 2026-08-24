import crypto from 'crypto';
import path from 'path';
import { AppError } from './errors';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const SIGNED_UPLOAD_EXPIRY_SECONDS = 60 * 60 * 2;

function getConfig() {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const legacyBucket = process.env.SUPABASE_STORAGE_BUCKET?.trim();
  const buckets = {
    avatars: process.env.SUPABASE_AVATAR_BUCKET?.trim() || legacyBucket || 'avatars',
    files: process.env.SUPABASE_FILES_BUCKET?.trim() || legacyBucket || 'medaxis-files',
    clinical: process.env.SUPABASE_CLINICAL_BUCKET?.trim() || legacyBucket || 'clinical-files',
  };

  if (!baseUrl || !serviceRoleKey) {
    throw new AppError(
      'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      500,
    );
  }

  return { baseUrl, serviceRoleKey, buckets };
}

function getBucket(storagePath: string) {
  const { buckets } = getConfig();
  if (storagePath.startsWith('profiles/')) return buckets.avatars;
  if (storagePath.startsWith('operations/')) return buckets.clinical;
  return buckets.files;
}

function encodeStoragePath(value: string) {
  return value
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

async function storageRequest<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const { baseUrl, serviceRoleKey } = getConfig();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${serviceRoleKey}`);
  headers.set('apikey', serviceRoleKey);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${baseUrl}/storage/v1${endpoint}`, { ...init, headers });
  if (!response.ok) {
    const text = await response.text();
    console.error('Supabase Storage request failed:', response.status, text);
    throw new AppError('File storage operation failed', 502);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function sanitizeFileName(fileName: string) {
  const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, '');
  const base = path.basename(fileName, path.extname(fileName))
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'file';
  return `${base}${ext}`;
}

export function createOperationStoragePath(operationId: string, fileName: string) {
  return `operations/${operationId}/${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
}

export function validateFileMetadata(fileName: string, mimeType: string, fileSize: number) {
  if (!fileName?.trim()) throw new AppError('File name is required', 400);
  if (!Number.isFinite(fileSize) || fileSize <= 0) throw new AppError('File size must be greater than zero', 400);
  if (fileSize > MAX_FILE_SIZE) throw new AppError('File too large. Maximum size is 50MB', 400);

  const allowedMimes = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif',
    'application/pdf',
    'application/dicom',
    'application/octet-stream',
  ]);
  if (!allowedMimes.has(mimeType)) throw new AppError(`Unsupported file type: ${mimeType}`, 400);
}

export async function uploadOperationFile(storagePath: string, file: { buffer: Buffer; mimetype: string; size: number }) {
  validateFileMetadata(storagePath, file.mimetype, file.size);
  const bucket = getBucket(storagePath);
  await storageRequest(`/object/${encodeURIComponent(bucket)}/${encodeStoragePath(storagePath)}`, {
    method: 'POST',
    headers: { 'Content-Type': file.mimetype || 'application/octet-stream', 'x-upsert': 'false', 'cache-control': '3600' },
    body: file.buffer as any,
  });
  return storagePath;
}

export async function createSignedUploadUrl(storagePath: string, mimeType: string, fileSize: number) {
  validateFileMetadata(storagePath, mimeType, fileSize);
  const { baseUrl } = getConfig();
  const bucket = getBucket(storagePath);
  const encodedPath = encodeStoragePath(storagePath);
  const data = await storageRequest<{ url: string }>(`/object/upload/sign/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  const signedUrl = new URL(data.url, `${baseUrl}/storage/v1`).toString();
  const token = new URL(signedUrl).searchParams.get('token');
  if (!token) throw new AppError('Storage did not return an upload token', 502);
  return { path: storagePath, token, signedUrl, expiresIn: SIGNED_UPLOAD_EXPIRY_SECONDS };
}

export async function assertStoredFileExists(storagePath: string) {
  const { baseUrl, serviceRoleKey } = getConfig();
  const bucket = getBucket(storagePath);
  const response = await fetch(`${baseUrl}/storage/v1/object/info/${encodeURIComponent(bucket)}/${encodeStoragePath(storagePath)}`, {
    method: 'HEAD',
    headers: { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey },
  });
  if (!response.ok) throw new AppError('Uploaded file was not found in storage', 400);
}

export function createPublicFileUrl(storagePath: string) {
  const { baseUrl } = getConfig();
  const bucket = getBucket(storagePath);
  return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeStoragePath(storagePath)}`;
}

export async function createSignedDownloadUrl(storagePath: string) {
  return { url: createPublicFileUrl(storagePath), expiresIn: 0 };
}

export async function deleteStoredFile(storagePath: string) {
  const bucket = getBucket(storagePath);
  await storageRequest(`/object/${encodeURIComponent(bucket)}`, {
    method: 'DELETE',
    body: JSON.stringify({ prefixes: [storagePath] }),
  });
}
