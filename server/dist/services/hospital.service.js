"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalService = void 0;
const hospital_repo_1 = require("../repositories/hospital.repo");
const errors_1 = require("../utils/errors");
class HospitalService {
    async getAll(params) {
        return hospital_repo_1.hospitalRepo.findAll(params);
    }
    async getActive(userId) {
        return hospital_repo_1.hospitalRepo.findActive(userId);
    }
    async getById(id, userId) {
        const hospital = await hospital_repo_1.hospitalRepo.findById(id, userId);
        if (!hospital)
            throw new errors_1.NotFoundError('Hospital');
        return hospital;
    }
    async assertAccessible(id, userId) {
        await this.getById(id, userId);
    }
    async create(data, userId) {
        return hospital_repo_1.hospitalRepo.create({ ...data, createdBy: userId });
    }
    async update(id, userId, data) {
        const owned = await hospital_repo_1.hospitalRepo.findOwned(id, userId);
        if (!owned)
            throw new errors_1.NotFoundError('Hospital');
        return hospital_repo_1.hospitalRepo.update(id, data);
    }
    async delete(id, userId) {
        const owned = await hospital_repo_1.hospitalRepo.findOwned(id, userId);
        if (!owned)
            throw new errors_1.NotFoundError('Hospital');
        return hospital_repo_1.hospitalRepo.delete(id);
    }
}
exports.hospitalService = new HospitalService();
//# sourceMappingURL=hospital.service.js.map