"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicFileUrl = toPublicFileUrl;
exports.mapOperationFile = mapOperationFile;
function toPublicFileUrl(file) {
    return `/api/operations/${file.operationId}/files/${file.id}/download`;
}
function mapOperationFile(file) {
    const url = toPublicFileUrl(file);
    return {
        ...file,
        url,
        fileUrl: url,
    };
}
//# sourceMappingURL=operationFile.js.map