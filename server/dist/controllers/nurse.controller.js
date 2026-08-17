"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nurseController = exports.NurseController = void 0;
const nurse_service_1 = require("../services/nurse.service");
const response_1 = require("../utils/response");
const nurse_validator_1 = require("../validators/nurse.validator");
const errors_1 = require("../utils/errors");
function userId(req) {
    return req.user?.userId;
}
class NurseController {
    async getAll(req, res, next) {
        try {
            const parsed = nurse_validator_1.nurseQuerySchema.safeParse(req.query);
            const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
            const { data, total } = await nurse_service_1.nurseService.getAll({ ...params, userId: userId(req) });
            return (0, response_1.sendPaginated)(res, data, params.page, params.limit, total);
        }
        catch (err) {
            next(err);
        }
    }
    async getActive(req, res, next) {
        try {
            const nurses = await nurse_service_1.nurseService.getActive(userId(req));
            return (0, response_1.sendSuccess)(res, nurses);
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const nurse = await nurse_service_1.nurseService.getById(req.params.id, userId(req));
            return (0, response_1.sendSuccess)(res, nurse);
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const parsed = nurse_validator_1.createNurseSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const nurse = await nurse_service_1.nurseService.create(parsed.data, userId(req));
            return (0, response_1.sendSuccess)(res, nurse, 'Nurse created', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const parsed = nurse_validator_1.updateNurseSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const nurse = await nurse_service_1.nurseService.update(req.params.id, userId(req), parsed.data);
            return (0, response_1.sendSuccess)(res, nurse, 'Nurse updated');
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            await nurse_service_1.nurseService.delete(req.params.id, userId(req));
            return (0, response_1.sendSuccess)(res, null, 'Nurse deleted');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.NurseController = NurseController;
exports.nurseController = new NurseController();
//# sourceMappingURL=nurse.controller.js.map