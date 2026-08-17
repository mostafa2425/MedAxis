export declare function toPublicFileUrl(file: {
    id: string;
    operationId: string;
}): string;
export declare function mapOperationFile<T extends {
    id: string;
    operationId: string;
}>(file: T): T & {
    url: string;
    fileUrl: string;
};
//# sourceMappingURL=operationFile.d.ts.map