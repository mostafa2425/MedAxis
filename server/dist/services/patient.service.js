"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientService = void 0;
const patient_repo_1 = require("../repositories/patient.repo");
const errors_1 = require("../utils/errors");
class PatientService {
    async getAll(params) {
        return patient_repo_1.patientRepo.findAll(params);
    }
    async getById(id, createdBy) {
        const patient = await patient_repo_1.patientRepo.findById(id, createdBy);
        if (!patient)
            throw new errors_1.NotFoundError('Patient');
        return patient;
    }
    async create(data, createdBy) {
        return patient_repo_1.patientRepo.create({ ...data, createdBy });
    }
    async update(id, createdBy, data) {
        await this.getById(id, createdBy);
        return patient_repo_1.patientRepo.update(id, createdBy, data);
    }
    async delete(id, createdBy) {
        await this.getById(id, createdBy);
        return patient_repo_1.patientRepo.delete(id, createdBy);
    }
    async getRecent(createdBy, limit = 5) {
        return patient_repo_1.patientRepo.findRecent(createdBy, limit);
    }
}
exports.patientService = new PatientService();
//# sourceMappingURL=patient.service.js.map