"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorController = exports.DoctorController = void 0;
const doctor_service_1 = require("../services/doctor.service");
const response_1 = require("../utils/response");
const doctor_validator_1 = require("../validators/doctor.validator");
const errors_1 = require("../utils/errors");
function userId(req) {
    return req.user?.userId;
}
class DoctorController {
    async getAll(req, res, next) {
        try {
            const parsed = doctor_validator_1.doctorQuerySchema.safeParse(req.query);
            const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
            const { data, total } = await doctor_service_1.doctorService.getAll({ ...params, userId: userId(req) });
            return (0, response_1.sendPaginated)(res, data, params.page, params.limit, total);
        }
        catch (err) {
            next(err);
        }
    }
    async getActive(req, res, next) {
        try {
            const doctors = await doctor_service_1.doctorService.getActive(userId(req));
            return (0, response_1.sendSuccess)(res, doctors);
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const doctor = await doctor_service_1.doctorService.getById(req.params.id, userId(req));
            return (0, response_1.sendSuccess)(res, doctor);
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const parsed = doctor_validator_1.createDoctorSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const doctor = await doctor_service_1.doctorService.create(parsed.data, userId(req));
            return (0, response_1.sendSuccess)(res, doctor, 'Doctor created', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const parsed = doctor_validator_1.updateDoctorSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const doctor = await doctor_service_1.doctorService.update(req.params.id, userId(req), parsed.data);
            return (0, response_1.sendSuccess)(res, doctor, 'Doctor updated');
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            await doctor_service_1.doctorService.delete(req.params.id, userId(req));
            return (0, response_1.sendSuccess)(res, null, 'Doctor deleted');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.DoctorController = DoctorController;
exports.doctorController = new DoctorController();
//# sourceMappingURL=doctor.controller.js.map