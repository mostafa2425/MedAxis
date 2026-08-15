import path from 'path';

export function toPublicFileUrl(filePath: string): string {
  const normalized = String(filePath || '').replace(/\\/g, '/');
  const fileName = path.posix.basename(normalized);
  return `/uploads/${fileName}`;
}

export function mapOperationFile<T extends { filePath: string }>(file: T) {
  const url = toPublicFileUrl(file.filePath);
  return {
    ...file,
    url,
    fileUrl: url,
  };
}
