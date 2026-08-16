export function toPublicFileUrl(file: { id: string; operationId: string }) {
  return `/api/operations/${file.operationId}/files/${file.id}/download`;
}

export function mapOperationFile<T extends { id: string; operationId: string }>(file: T) {
  const url = toPublicFileUrl(file);
  return {
    ...file,
    url,
    fileUrl: url,
  };
}
