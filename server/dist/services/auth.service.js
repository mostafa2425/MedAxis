"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_repo_1 = require("../repositories/user.repo");
const doctor_repo_1 = require("../repositories/doctor.repo");
const specialty_service_1 = require("./specialty.service");
const auth_1 = require("../utils/auth");
const errors_1 = require("../utils/errors");
function toSpecialtyRef(link) {
    return {
        id: link.specialty.id,
        name: link.specialty.name,
        nameAr: link.specialty.nameAr,
    };
}
function toAuthUser(user, doctor) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone ?? doctor?.phone ?? null,
        role: user.role,
        isActive: user.isActive,
        doctorId: doctor?.id ?? null,
        specialties: doctor ? doctor.specialties.map(toSpecialtyRef) : [],
        subspecialties: doctor ? doctor.subspecialties.map(toSpecialtyRef) : [],
        ...(user.createdAt ? { createdAt: user.createdAt } : {}),
        ...(user.updatedAt ? { updatedAt: user.updatedAt } : {}),
    };
}
async function resolveSpecialtyLinks(specialtyIds, subspecialtyIds) {
    const validSpecialtyIds = await specialty_service_1.specialtyService.assertTopLevelSpecialtyIds(specialtyIds);
    const validSubspecialtyIds = await specialty_service_1.specialtyService.assertSubspecialtyIds(subspecialtyIds, validSpecialtyIds);
    return { validSpecialtyIds, validSubspecialtyIds };
}
class AuthService {
    async login(email, password) {
        const user = await user_repo_1.userRepo.findByEmail(email);
        if (!user)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        if (!user.isActive)
            throw new errors_1.UnauthorizedError('Account is deactivated');
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
        if (!isPasswordValid)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const token = (0, auth_1.generateToken)(payload);
        const doctor = await doctor_repo_1.doctorRepo.findByUserId(user.id);
        return {
            token,
            user: toAuthUser(user, doctor),
        };
    }
    async register(email, password, name, specialtyIds, phone, subspecialtyIds) {
        const existingUser = await user_repo_1.userRepo.findByEmail(email);
        if (existingUser)
            throw new errors_1.ConflictError('User with this email');
        const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(specialtyIds, subspecialtyIds);
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const user = await user_repo_1.userRepo.create({
            email,
            password: hashedPassword,
            name,
            phone,
        });
        const doctor = await doctor_repo_1.doctorRepo.create({
            name: user.name,
            phone: user.phone,
            email: user.email,
            userId: user.id,
            createdBy: user.id,
        }, validSpecialtyIds, validSubspecialtyIds);
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const token = (0, auth_1.generateToken)(payload);
        return {
            token,
            user: toAuthUser(user, doctor),
        };
    }
    async getMe(userId) {
        const user = await user_repo_1.userRepo.findById(userId);
        if (!user)
            throw new errors_1.UnauthorizedError('User not found');
        const doctor = await doctor_repo_1.doctorRepo.findByUserId(userId);
        return toAuthUser(user, doctor);
    }
    async updateProfile(userId, input) {
        const user = await user_repo_1.userRepo.findById(userId);
        if (!user)
            throw new errors_1.UnauthorizedError('User not found');
        const userUpdate = {};
        if (input.name !== undefined)
            userUpdate.name = input.name.trim();
        if (input.phone !== undefined) {
            const trimmed = input.phone?.trim();
            userUpdate.phone = trimmed ? trimmed : null;
        }
        if (Object.keys(userUpdate).length > 0) {
            await user_repo_1.userRepo.update(userId, userUpdate);
        }
        let doctor = await doctor_repo_1.doctorRepo.findByUserId(userId);
        const nextName = userUpdate.name ?? user.name;
        const nextPhone = userUpdate.phone !== undefined ? userUpdate.phone : (user.phone ?? doctor?.phone ?? null);
        if (!doctor && input.specialtyIds) {
            const { validSpecialtyIds, validSubspecialtyIds } = await resolveSpecialtyLinks(input.specialtyIds, input.subspecialtyIds);
            doctor = await doctor_repo_1.doctorRepo.create({
                name: nextName,
                phone: nextPhone,
                email: user.email,
                userId,
            }, validSpecialtyIds, validSubspecialtyIds);
        }
        else if (doctor) {
            const doctorUpdate = {};
            if (userUpdate.name !== undefined)
                doctorUpdate.name = userUpdate.name;
            if (userUpdate.phone !== undefined)
                doctorUpdate.phone = userUpdate.phone;
            if (Object.keys(doctorUpdate).length > 0) {
                await doctor_repo_1.doctorRepo.update(doctor.id, doctorUpdate);
            }
            if (input.specialtyIds) {
                const validSpecialtyIds = await specialty_service_1.specialtyService.assertTopLevelSpecialtyIds(input.specialtyIds);
                const validSubspecialtyIds = input.subspecialtyIds !== undefined
                    ? await specialty_service_1.specialtyService.assertSubspecialtyIds(input.subspecialtyIds, validSpecialtyIds)
                    : await specialty_service_1.specialtyService.filterSubspecialtyIds(doctor.subspecialties.map((link) => link.specialtyId), validSpecialtyIds);
                doctor = await doctor_repo_1.doctorRepo.setSpecialtyLinks(doctor.id, validSpecialtyIds, validSubspecialtyIds);
            }
            else {
                doctor = await doctor_repo_1.doctorRepo.findByUserId(userId);
            }
        }
        const updatedUser = await user_repo_1.userRepo.findById(userId);
        if (!updatedUser)
            throw new errors_1.UnauthorizedError('User not found');
        return toAuthUser(updatedUser, doctor);
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map