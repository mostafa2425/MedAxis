export declare function createOperationStoragePath(operationId: string, fileName: string): string;
export declare function validateFileMetadata(fileName: string, mimeType: string, fileSize: number): void;
export declare function uploadOperationFile(storagePath: string, file: {
    buffer: Buffer;
    mimetype: string;
    size: number;
}): Promise<string>;
export declare function createSignedUploadUrl(storagePath: string, mimeType: string, fileSize: number): Promise<{
    path: string;
    token: string;
    signedUrl: string;
    expiresIn: number;
}>;
export declare function assertStoredFileExists(storagePath: string): Promise<void>;
export declare function createSignedDownloadUrl(storagePath: string): Promise<{
    url: string;
    expiresIn: number;
}>;
export declare function deleteStoredFile(storagePath: string): Promise<void>;
//# sourceMappingURL=supabaseStorage.d.ts.map