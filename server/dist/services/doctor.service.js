"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorService = void 0;
const doctor_repo_1 = require("../repositories/doctor.repo");
const specialty_service_1 = require("./specialty.service");
const errors_1 = require("../utils/errors");
function toSpecialtyRef(link) {
    return {
        id: link.specialty.id,
        name: link.specialty.name,
        nameAr: link.specialty.nameAr,
    };
}
function toDoctorResponse(doctor) {
    return {
        id: doctor.id,
        name: doctor.name,
        phone: doctor.phone,
        email: doctor.email,
        isActive: doctor.isActive,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
        specialties: doctor.specialties.map(toSpecialtyRef),
        subspecialties: doctor.subspecialties.map(toSpecialtyRef),
    };
}
async function resolveSpecialtyLinks(specialtyIds, subspecialtyIds) {
    const validSpecialtyIds = await specialty_service_1.specialtyService.assertTopLevelSpecialtyIds(specialtyIds);
    const validSubspecialtyIds = await specialty_service_1.specialtyService.assertSubspecialtyIds(subspecialtyIds, validSpecialtyIds);
    return { validSpecialtyIds, validSubspecialtyIds };
}
class DoctorService {
    async getAll(params) {
        const { data, total } = await doctor_repo_1.doctorRepo.findAll(params);
        return { data: data.map(toDoctorResponse), total };
    }
    async getActive(userId) {
        const doctors = await doctor_repo_1.doctorRepo.findActive(userId);
        return doctors.map(toDoctorResponse);
    }
    async getById(id, userId) {
        const doctor = await doctor_repo_1.doctorRepo.findById(id, userId);
        if (!doctor)
            throw new errors_1.NotFoundError('Doctor');
        return toDoctorResponse(doctor);
    }
    async assertAccessible(id, userId) {
        await this.getById(id, userId);
    }
    async create(input, userId) {
        const { specialtyIds, subspecialtyIds, ...data } = input;
        const duplicate = await doctor_repo_1.doctorRepo.findDuplicate(userId, data.email, data.name);
        if (duplicate) {
            return toDoctorResponse(duplicate);
        }
        const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(specialtyIds, subspecialtyIds);
        const doctor = await doctor_repo_1.doctorRepo.create({
            name: data.name,
            phone: data.phone ?? null,
            email: data.email ?? null,
            createdBy: userId,
        }, validSpecialtyIds, validSubspecialtyIds);
        return toDoctorResponse(doctor);
    }
    async update(id, userId, input) {
        const owned = await doctor_repo_1.doctorRepo.findOwned(id, userId);
        if (!owned)
            throw new errors_1.NotFoundError('Doctor');
        const { specialtyIds, subspecialtyIds, ...data } = input;
        if (Object.keys(data).length > 0) {
            await doctor_repo_1.doctorRepo.update(id, data);
        }
        if (specialtyIds !== undefined || subspecialtyIds !== undefined) {
            const current = await doctor_repo_1.doctorRepo.findById(id, userId);
            const nextSpecialtyIds = specialtyIds ?? current?.specialties.map((link) => link.specialtyId) ?? [];
            const nextSubspecialtyIds = subspecialtyIds ?? current?.subspecialties.map((link) => link.specialtyId) ?? [];
            const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(nextSpecialtyIds, nextSubspecialtyIds);
            const doctor = await doctor_repo_1.doctorRepo.setSpecialtyLinks(id, validSpecialtyIds, validSubspecialtyIds);
            if (!doctor)
                throw new errors_1.NotFoundError('Doctor');
            return toDoctorResponse(doctor);
        }
        return this.getById(id, userId);
    }
    async delete(id, userId) {
        const owned = await doctor_repo_1.doctorRepo.findOwned(id, userId);
        if (!owned)
            throw new errors_1.NotFoundError('Doctor');
        if (owned.userId === userId) {
            throw new errors_1.ForbiddenError('Cannot remove your own doctor profile');
        }
        return doctor_repo_1.doctorRepo.delete(id);
    }
}
exports.doctorService = new DoctorService();
//# sourceMappingURL=doctor.service.js.map