"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationController = exports.OperationController = void 0;
const operation_service_1 = require("../services/operation.service");
const response_1 = require("../utils/response");
const surgery_validator_1 = require("../validators/surgery.validator");
const fileUpload_validator_1 = require("../validators/fileUpload.validator");
const errors_1 = require("../utils/errors");
const fileType_1 = require("../utils/fileType");
function collectUploadedFiles(req) {
    const files = [];
    if (req.file)
        files.push(req.file);
    if (Array.isArray(req.files))
        files.push(...req.files);
    else if (req.files && typeof req.files === 'object') {
        for (const value of Object.values(req.files))
            if (Array.isArray(value))
                files.push(...value);
    }
    return files;
}
class OperationController {
    async getAll(req, res, next) {
        try {
            const parsed = surgery_validator_1.operationQuerySchema.safeParse(req.query);
            const params = parsed.success ? parsed.data : { page: 1, limit: 20, sortBy: 'operationDate', sortOrder: 'desc' };
            const userId = req.user?.userId;
            const { data, total } = await operation_service_1.operationService.getAll({ page: params.page, limit: params.limit, sortBy: params.sortBy, sortOrder: params.sortOrder, search: 'search' in params ? params.search : undefined, status: 'status' in params ? params.status : undefined, specialtyId: 'specialtyId' in params ? params.specialtyId : undefined, hospitalId: 'hospitalId' in params ? params.hospitalId : undefined, dateFrom: 'dateFrom' in params ? params.dateFrom : undefined, dateTo: 'dateTo' in params ? params.dateTo : undefined, createdBy: userId });
            return (0, response_1.sendPaginated)(res, data, params.page, params.limit, total);
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const operation = await operation_service_1.operationService.getById(req.params.id, req.user?.userId);
            return (0, response_1.sendSuccess)(res, operation);
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const parsed = surgery_validator_1.createOperationSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            const operation = await operation_service_1.operationService.create(parsed.data, req.user?.userId);
            return (0, response_1.sendSuccess)(res, operation, 'Operation created', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const parsed = surgery_validator_1.updateOperationSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            const operation = await operation_service_1.operationService.update(req.params.id, req.user?.userId, parsed.data);
            return (0, response_1.sendSuccess)(res, operation, 'Operation updated');
        }
        catch (err) {
            next(err);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const parsed = surgery_validator_1.updateStatusSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            const operation = await operation_service_1.operationService.updateStatus(req.params.id, req.user?.userId, parsed.data.status);
            return (0, response_1.sendSuccess)(res, operation, 'Status updated');
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            await operation_service_1.operationService.delete(req.params.id, req.user?.userId);
            return (0, response_1.sendSuccess)(res, null, 'Operation deleted');
        }
        catch (err) {
            next(err);
        }
    }
    async updateCost(req, res, next) {
        try {
            const parsed = surgery_validator_1.updateCostSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            const cost = await operation_service_1.operationService.updateCost(req.params.id, req.user?.userId, parsed.data);
            return (0, response_1.sendSuccess)(res, cost, 'Cost updated');
        }
        catch (err) {
            next(err);
        }
    }
    async uploadFiles(req, res, next) {
        try {
            const fileType = (0, fileType_1.resolveFileType)(req.body?.fileType);
            const files = collectUploadedFiles(req);
            if (!files.length)
                throw new errors_1.AppError('No files uploaded', 400, [{ path: ['file'], code: 'custom', message: 'A file is required' }]);
            const uploadedFiles = await operation_service_1.operationService.uploadFiles(req.params.id, req.user?.userId, files, fileType);
            return (0, response_1.sendSuccess)(res, uploadedFiles, 'Files uploaded', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async createFileUploadUrl(req, res, next) {
        try {
            const parsed = fileUpload_validator_1.createUploadUrlSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            const result = await operation_service_1.operationService.createFileUploadUrl(req.params.id, req.user?.userId, parsed.data);
            return (0, response_1.sendSuccess)(res, result, 'Signed upload URL created');
        }
        catch (err) {
            next(err);
        }
    }
    async completeFileUpload(req, res, next) {
        try {
            const parsed = fileUpload_validator_1.completeUploadSchema.safeParse(req.body);
            if (!parsed.success)
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            const result = await operation_service_1.operationService.completeFileUpload(req.params.id, req.user?.userId, parsed.data);
            return (0, response_1.sendSuccess)(res, result, 'File upload completed', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async downloadFile(req, res, next) {
        try {
            const result = await operation_service_1.operationService.getFileDownloadUrl(req.params.operationId, req.params.fileId, req.user?.userId);
            return res.redirect(result.url);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteFile(req, res, next) {
        try {
            const result = await operation_service_1.operationService.deleteFile(req.params.operationId, req.params.fileId, req.user?.userId);
            return (0, response_1.sendSuccess)(res, result, 'File deleted');
        }
        catch (err) {
            next(err);
        }
    }
    async getTimeline(req, res, next) {
        try {
            const timeline = await operation_service_1.operationService.getTimeline(req.params.id, req.user?.userId);
            return (0, response_1.sendSuccess)(res, timeline);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.OperationController = OperationController;
exports.operationController = new OperationController();
//# sourceMappingURL=operation.controller.js.map