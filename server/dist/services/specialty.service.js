"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyService = void 0;
const specialty_repo_1 = require("../repositories/specialty.repo");
const errors_1 = require("../utils/errors");
class SpecialtyService {
    async getAll(params) {
        return specialty_repo_1.specialtyRepo.findAll(params);
    }
    async getById(id) {
        const specialty = await specialty_repo_1.specialtyRepo.findById(id);
        if (!specialty)
            throw new errors_1.NotFoundError('Specialty');
        return specialty;
    }
    async create(data) {
        const existing = await specialty_repo_1.specialtyRepo.findByName(data.name);
        if (existing)
            throw new errors_1.ConflictError('Specialty with this name');
        return specialty_repo_1.specialtyRepo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        if (data.name) {
            const existing = await specialty_repo_1.specialtyRepo.findByName(data.name);
            if (existing && existing.id !== id)
                throw new errors_1.ConflictError('Specialty with this name');
        }
        return specialty_repo_1.specialtyRepo.update(id, data);
    }
    async delete(id) {
        await this.getById(id);
        return specialty_repo_1.specialtyRepo.delete(id);
    }
    async getWithOperationsCount() {
        return specialty_repo_1.specialtyRepo.findWithOperationsCount();
    }
    async assertTopLevelSpecialtyIds(ids) {
        const unique = [...new Set(ids)];
        if (unique.length === 0) {
            throw new errors_1.BadRequestError('Please select at least one specialty', [
                {
                    path: ['specialtyIds'],
                    code: 'too_small',
                    message: 'Please select at least one specialty',
                },
            ]);
        }
        const found = await specialty_repo_1.specialtyRepo.findByIds(unique);
        if (found.length !== unique.length) {
            throw new errors_1.BadRequestError('One or more specialty IDs are invalid', [
                {
                    path: ['specialtyIds'],
                    code: 'custom',
                    message: 'One or more specialty IDs are invalid',
                },
            ]);
        }
        const nested = found.filter((specialty) => specialty.parentId);
        if (nested.length > 0) {
            throw new errors_1.BadRequestError('Areas of expertise cannot be used as top-level specialties', [
                {
                    path: ['specialtyIds'],
                    code: 'custom',
                    message: `${nested.map((item) => item.name).join(', ')} must be selected as areas of expertise`,
                },
            ]);
        }
        return unique;
    }
    async assertSubspecialtyIds(ids, parentIds) {
        const unique = [...new Set(ids ?? [])];
        if (unique.length === 0)
            return [];
        const found = await specialty_repo_1.specialtyRepo.findByIds(unique);
        if (found.length !== unique.length) {
            throw new errors_1.BadRequestError('One or more area of expertise IDs are invalid', [
                {
                    path: ['subspecialtyIds'],
                    code: 'custom',
                    message: 'One or more area of expertise IDs are invalid',
                },
            ]);
        }
        const parentSet = new Set(parentIds);
        const invalid = found.filter((specialty) => !specialty.parentId || !parentSet.has(specialty.parentId));
        if (invalid.length > 0) {
            const names = invalid.map((item) => item.name).join(', ');
            const message = `${names} is not a subspecialty of the selected specialties.`;
            throw new errors_1.BadRequestError(message, [
                {
                    path: ['subspecialtyIds'],
                    code: 'custom',
                    message,
                },
            ]);
        }
        return found.map((specialty) => specialty.id);
    }
    async filterSubspecialtyIds(ids, parentIds) {
        const unique = [...new Set(ids ?? [])];
        if (unique.length === 0)
            return [];
        const found = await specialty_repo_1.specialtyRepo.findByIds(unique);
        const parentSet = new Set(parentIds);
        return found
            .filter((specialty) => specialty.parentId && parentSet.has(specialty.parentId))
            .map((specialty) => specialty.id);
    }
}
exports.specialtyService = new SpecialtyService();
//# sourceMappingURL=specialty.service.js.map