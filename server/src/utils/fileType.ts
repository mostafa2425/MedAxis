import { FileType } from '../prisma';
import { BadRequestError } from './errors';

const ALIASES: Record<string, FileType> = {
  BEFORE_OPERATION: FileType.BEFORE_IMAGE,
  AFTER_OPERATION: FileType.AFTER_IMAGE,
};

const ALLOWED = new Set<string>(Object.values(FileType));

export function resolveFileType(input?: string): FileType {
  const raw = (input || FileType.BEFORE_IMAGE).trim().toUpperCase();
  const mapped = ALIASES[raw] ?? raw;

  if (!ALLOWED.has(mapped)) {
    throw new BadRequestError('Invalid file type', [
      { path: ['fileType'], code: 'custom', message: `Invalid file type. Allowed: ${[...ALLOWED].join(', ')} (aliases: BEFORE_OPERATION, AFTER_OPERATION)` },
    ]);
  }

  return mapped as FileType;
}
