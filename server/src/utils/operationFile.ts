import { createPublicFileUrl } from './supabaseStorage';

type OperationFileLike = Record<string, unknown> & {
  id: string;
  operationId: string;
  filePath?: string | null;
};

export function toPublicFileUrl(file: OperationFileLike) {
  if (file.filePath) {
    try {
      return createPublicFileUrl(file.filePath);
    } catch {
      // Keep the API fallback usable when storage configuration is unavailable.
    }
  }
  return `/api/operations/${file.operationId}/files/${file.id}/download`;
}

/**
 * Accept Prisma objects as well as rows returned by the legacy raw-SQL
 * operation-file insert. The latter is intentionally typed as Record<string,
 * unknown> because Prisma's generated model does not expose storagePath.
 */
export function mapOperationFile(file: Record<string, unknown>) {
  const normalized = {
    ...file,
    id: String(file.id),
    operationId: String(file.operationId),
    filePath: file.filePath == null ? null : String(file.filePath),
  } as OperationFileLike;
  const url = toPublicFileUrl(normalized);
  return { ...normalized, url, fileUrl: url };
}
