import { createPublicFileUrl } from './supabaseStorage';

export function toPublicFileUrl(file: { id: string; operationId: string; filePath?: string | null }) {
  if (file.filePath) {
    try {
      return createPublicFileUrl(file.filePath);
    } catch {
      // Keep the API fallback usable when storage configuration is unavailable.
    }
  }
  return `/api/operations/${file.operationId}/files/${file.id}/download`;
}

export function mapOperationFile<T extends { id: string; operationId: string; filePath?: string | null }>(file: T) {
  const url = toPublicFileUrl(file);
  return { ...file, url, fileUrl: url };
}
