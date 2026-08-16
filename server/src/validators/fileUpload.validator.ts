import { z } from 'zod';

const fileType = z.enum([
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

export const createUploadUrlSchema = z.object({
  fileName: z.string().trim().min(1, 'File name is required'),
  mimeType: z.string().trim().min(1, 'MIME type is required'),
  fileSize: z.coerce.number().int().positive('File size must be greater than zero'),
  fileType,
});

export const completeUploadSchema = createUploadUrlSchema.extend({
  filePath: z.string().trim().min(1, 'File path is required'),
});

export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>;
export type CompleteUploadInput = z.infer<typeof completeUploadSchema>;
