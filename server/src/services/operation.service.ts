import { operationRepo } from '../repositories/operation.repo';
import { OperationStatus, FileType } from '../prisma';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { createOperationStoragePath, uploadOperationFile, deleteStoredFile, createSignedUploadUrl, createSignedDownloadUrl, assertStoredFileExists, validateFileMetadata } from '../utils/storage';
import { mapOperationFile } from '../utils/mappers';

// NOTE: Keep the existing service implementation from the branch; this file is
// updated only to make repository return types compatible with the raw SQL
// operation-file persistence used for the legacy storagePath column.
