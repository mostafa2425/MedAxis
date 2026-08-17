"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nurseService = void 0;
const nurse_repo_1 = require("../repositories/nurse.repo");
const errors_1 = require("../utils/errors");
class NurseService {
    async getAll(params) {
        return nurse_repo_1.nurseRepo.findAll(params);
    }
    async getActive(userId) {
        return nurse_repo_1.nurseRepo.findActive(userId);
    }
    async getById(id, userId) {
        const nurse = await nurse_repo_1.nurseRepo.findById(id, userId);
        if (!nurse)
            throw new errors_1.NotFoundError('Nurse');
        return nurse;
    }
    async assertAccessible(id, userId) {
        await this.getById(id, userId);
    }
    async create(input, userId) {
        const duplicate = await nurse_repo_1.nurseRepo.findDuplicate(userId, input.name, input.email);
        if (duplicate)
            return duplicate;
        return nurse_repo_1.nurseRepo.create({
            name: input.name,
            phone: input.phone ?? null,
            email: input.email ?? null,
            createdBy: userId,
        });
    }
    async update(id, userId, input) {
        await this.getById(id, userId);
        return nurse_repo_1.nurseRepo.update(id, input);
    }
    async delete(id, userId) {
        await this.getById(id, userId);
        return nurse_repo_1.nurseRepo.delete(id);
    }
}
exports.nurseService = new NurseService();
//# sourceMappingURL=nurse.service.js.map