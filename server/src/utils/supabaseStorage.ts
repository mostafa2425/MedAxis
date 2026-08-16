import crypto from 'crypto';
import path from 'path';
import { AppError } from './errors';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const SIGNED_UPLOAD_EXPIRY_SECONDS = 60 * 60 * 2;
const SIGNED_DOWNLOAD_EXPIRY_SECONDS = 60 * 10;

function getConfig() {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'medaxis-files';

  if (!baseUrl || !serviceRoleKey) {
    throw new AppError(
      'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      500,
    );
  }

  return { baseUrl, serviceRoleKey, bucket };
}

function encodeStoragePath(value: string) {
  return value
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

async function storageRequest<T>(
  endpoint: string,
  init: RequestInit = {},
): Promise<T> {
  const { baseUrl, serviceRoleKey } = getConfig();
  const response = await fetch(`${baseUrl}/storage/v1${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init.headers || {}),
    },
  });

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
  if (!fileName?.trim()) {
    throw new AppError('File name is required', 400, [
      { path: ['fileName'], code: 'custom', message: 'File name is required' },
    ]);
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new AppError('File size must be greater than zero', 400, [
      { path: ['fileSize'], code: 'custom', message: 'File size must be greater than zero' },
    ]);
  }

  if (fileSize > MAX_FILE_SIZE) {
    throw new AppError('File too large. Maximum size is 50MB', 400, [
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
    throw new AppError(`Unsupported file type: ${mimeType}`, 400, [
      { path: ['mimeType'], code: 'custom', message: `Unsupported file type: ${mimeType}` },
    ]);
  }
}

export async function uploadOperationFile(
  storagePath: string,
  file: { buffer: Buffer; mimetype: string; size: number },
) {
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
    body: file.buffer as unknown as BodyInit,
  });

  return storagePath;
}

export async function createSignedUploadUrl(storagePath: string, mimeType: string, fileSize: number) {
  validateFileMetadata(storagePath, mimeType, fileSize);
  const { bucket } = getConfig();
  const encodedPath = encodeStoragePath(storagePath);
  const data = await storageRequest<{ url: string }>(
    `/object/upload/sign/${encodeURIComponent(bucket)}/${encodedPath}`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    },
  );

  const signedUrl = new URL(data.url, getConfig().baseUrl + '/storage/v1').toString();
  const token = new URL(signedUrl).searchParams.get('token');
  if (!token) throw new AppError('Storage did not return an upload token', 502);

  return {
    path: storagePath,
    token,
    signedUrl,
    expiresIn: SIGNED_UPLOAD_EXPIRY_SECONDS,
  };
}

export async function assertStoredFileExists(storagePath: string) {
  const { baseUrl, serviceRoleKey, bucket } = getConfig();
  const response = await fetch(
    `${baseUrl}/storage/v1/object/info/${encodeURIComponent(bucket)}/${encodeStoragePath(storagePath)}`,
    {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    },
  );

  if (!response.ok) {
    throw new AppError('Uploaded file was not found in storage', 400, [
      { path: ['filePath'], code: 'custom', message: 'Upload the file before completing the upload' },
    ]);
  }
}

export async function createSignedDownloadUrl(storagePath: string) {
  const { bucket, baseUrl } = getConfig();
  const encodedPath = encodeStoragePath(storagePath);
  const data = await storageRequest<{ signedURL: string }>(
    `/object/sign/${encodeURIComponent(bucket)}/${encodedPath}`,
    {
      method: 'POST',
      body: JSON.stringify({ expiresIn: SIGNED_DOWNLOAD_EXPIRY_SECONDS }),
    },
  );

  return {
    url: new URL(data.signedURL, `${baseUrl}/storage/v1`).toString(),
    expiresIn: SIGNED_DOWNLOAD_EXPIRY_SECONDS,
  };
}

export async function deleteStoredFile(storagePath: string) {
  const { bucket } = getConfig();
  await storageRequest(`/object/${encodeURIComponent(bucket)}`, {
    method: 'DELETE',
    body: JSON.stringify({ prefixes: [storagePath] }),
  });
}
