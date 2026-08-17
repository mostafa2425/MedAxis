"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalController = exports.HospitalController = void 0;
const hospital_service_1 = require("../services/hospital.service");
const response_1 = require("../utils/response");
const hospital_validator_1 = require("../validators/hospital.validator");
const errors_1 = require("../utils/errors");
function userId(req) {
    return req.user?.userId;
}
class HospitalController {
    async getAll(req, res, next) {
        try {
            const parsed = hospital_validator_1.hospitalQuerySchema.safeParse(req.query);
            const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
            const { data, total } = await hospital_service_1.hospitalService.getAll({ ...params, userId: userId(req) });
            return (0, response_1.sendPaginated)(res, data, params.page, params.limit, total);
        }
        catch (err) {
            next(err);
        }
    }
    async getActive(req, res, next) {
        try {
            const hospitals = await hospital_service_1.hospitalService.getActive(userId(req));
            return (0, response_1.sendSuccess)(res, hospitals);
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const hospital = await hospital_service_1.hospitalService.getById(req.params.id, userId(req));
            return (0, response_1.sendSuccess)(res, hospital);
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const parsed = hospital_validator_1.createHospitalSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const hospital = await hospital_service_1.hospitalService.create(parsed.data, userId(req));
            return (0, response_1.sendSuccess)(res, hospital, 'Hospital created', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const parsed = hospital_validator_1.updateHospitalSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const hospital = await hospital_service_1.hospitalService.update(req.params.id, userId(req), parsed.data);
            return (0, response_1.sendSuccess)(res, hospital, 'Hospital updated');
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            await hospital_service_1.hospitalService.delete(req.params.id, userId(req));
            return (0, response_1.sendSuccess)(res, null, 'Hospital deleted');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.HospitalController = HospitalController;
exports.hospitalController = new HospitalController();
//# sourceMappingURL=hospital.controller.js.map