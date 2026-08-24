import { BadRequestError } from './errors';

type SupportedFileType =
  | 'BEFORE_IMAGE'
  | 'BEFORE_XRAY'
  | 'BEFORE_MRI'
  | 'BEFORE_CT'
  | 'BEFORE_LAB'
  | 'BEFORE_PDF'
  | 'AFTER_IMAGE'
  | 'AFTER_REPORT'
  | 'AFTER_PDF'
  | 'AFTER_OTHER';

const ALIASES: Record<string, SupportedFileType> = {
  BEFORE_OPERATION: 'BEFORE_IMAGE',
  AFTER_OPERATION: 'AFTER_IMAGE',
};

const ALLOWED = new Set<SupportedFileType>([
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

export function resolveFileType(input?: string): SupportedFileType {
  const raw = (input || 'BEFORE_IMAGE').trim().toUpperCase();
  const mapped = ALIASES[raw] ?? raw;

  if (!ALLOWED.has(mapped as SupportedFileType)) {
    throw new BadRequestError('Invalid file type', [
      {
        path: ['fileType'],
        code: 'custom',
        message: `Invalid file type. Allowed: ${[...ALLOWED].join(', ')} (aliases: BEFORE_OPERATION, AFTER_OPERATION)`,
      },
    ]);
  }

  return mapped as SupportedFileType;
}
