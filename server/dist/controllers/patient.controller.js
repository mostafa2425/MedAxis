"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientController = exports.PatientController = void 0;
const patient_service_1 = require("../services/patient.service");
const response_1 = require("../utils/response");
const patient_validator_1 = require("../validators/patient.validator");
const errors_1 = require("../utils/errors");
class PatientController {
    async getAll(req, res, next) {
        try {
            const parsed = patient_validator_1.patientQuerySchema.safeParse(req.query);
            const params = parsed.success ? parsed.data : { page: 1, limit: 20 };
            const userId = req.user?.userId;
            const { data, total } = await patient_service_1.patientService.getAll({
                ...params,
                createdBy: userId,
            });
            return (0, response_1.sendPaginated)(res, data, params.page, params.limit, total);
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const userId = req.user?.userId;
            const patient = await patient_service_1.patientService.getById(req.params.id, userId);
            return (0, response_1.sendSuccess)(res, patient);
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const parsed = patient_validator_1.createPatientSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const userId = req.user?.userId;
            const patient = await patient_service_1.patientService.create(parsed.data, userId);
            return (0, response_1.sendSuccess)(res, patient, 'Patient created', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const parsed = patient_validator_1.updatePatientSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const userId = req.user?.userId;
            const patient = await patient_service_1.patientService.update(req.params.id, userId, parsed.data);
            return (0, response_1.sendSuccess)(res, patient, 'Patient updated');
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            const userId = req.user?.userId;
            await patient_service_1.patientService.delete(req.params.id, userId);
            return (0, response_1.sendSuccess)(res, null, 'Patient deleted');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.PatientController = PatientController;
exports.patientController = new PatientController();
//# sourceMappingURL=patient.controller.js.map