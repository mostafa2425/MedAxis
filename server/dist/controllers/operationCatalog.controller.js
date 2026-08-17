"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationCatalogController = exports.OperationCatalogController = void 0;
const operationCatalog_service_1 = require("../services/operationCatalog.service");
const response_1 = require("../utils/response");
const operationCatalog_validator_1 = require("../validators/operationCatalog.validator");
const errors_1 = require("../utils/errors");
class OperationCatalogController {
    async getAll(req, res, next) {
        try {
            const userId = req.user?.userId;
            const items = await operationCatalog_service_1.operationCatalogService.listForUser(userId);
            return (0, response_1.sendSuccess)(res, items);
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const parsed = operationCatalog_validator_1.createCatalogItemSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const userId = req.user?.userId;
            const item = await operationCatalog_service_1.operationCatalogService.createCustom(userId, parsed.data.name);
            return (0, response_1.sendSuccess)(res, item, 'Custom operation created', 201);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.OperationCatalogController = OperationCatalogController;
exports.operationCatalogController = new OperationCatalogController();
//# sourceMappingURL=operationCatalog.controller.js.map