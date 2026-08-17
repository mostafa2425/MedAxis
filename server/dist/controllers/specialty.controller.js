"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyController = exports.SpecialtyController = void 0;
const specialty_service_1 = require("../services/specialty.service");
const doctor_repo_1 = require("../repositories/doctor.repo");
const response_1 = require("../utils/response");
const specialty_validator_1 = require("../validators/specialty.validator");
const errors_1 = require("../utils/errors");
const auth_1 = require("../utils/auth");
function resolveUserId(req) {
    const existing = req.user?.userId;
    if (existing)
        return existing;
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
        return undefined;
    try {
        return (0, auth_1.verifyToken)(header.slice(7)).userId;
    }
    catch {
        return undefined;
    }
}
class SpecialtyController {
    async getAll(req, res, next) {
        try {
            const parsed = specialty_validator_1.listSpecialtyQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const query = parsed.data;
            const userId = resolveUserId(req);
            const authenticatedDoctorRequest = Boolean(userId);
            let parentIds = query.parentIds;
            // Once a doctor is authenticated, the endpoint is intentionally scoped to
            // that doctor's top-level specialties. This keeps the existing public
            // catalog behavior available for unauthenticated onboarding screens.
            const mine = authenticatedDoctorRequest || query.mine;
            if (mine) {
                if (!userId)
                    throw new errors_1.UnauthorizedError('Authentication required');
                const doctor = await doctor_repo_1.doctorRepo.findByUserId(userId);
                const doctorSpecialtyIds = doctor
                    ? doctor.specialties.map((link) => link.specialtyId)
                    : [];
                const allowed = new Set(doctorSpecialtyIds);
                if (parentIds.length > 0) {
                    const invalid = parentIds.filter((id) => !allowed.has(id));
                    if (invalid.length > 0) {
                        throw new errors_1.BadRequestError('Requested parent specialties are not part of the current doctor profile', [
                            {
                                path: ['parentIds'],
                                code: 'custom',
                                message: 'Requested parent specialties are not part of the current doctor profile',
                            },
                        ]);
                    }
                }
                else {
                    parentIds = doctorSpecialtyIds;
                }
                if (parentIds.length === 0) {
                    if (query.page != null && query.limit != null) {
                        return (0, response_1.sendPaginated)(res, [], query.page, query.limit, 0);
                    }
                    return (0, response_1.sendSuccess)(res, []);
                }
            }
            const paginate = query.page != null && query.limit != null;
            const result = await specialty_service_1.specialtyService.getAll({
                parentIds: parentIds.length > 0 ? parentIds : undefined,
                rootsOnly: query.rootsOnly && parentIds.length === 0,
                search: query.search,
                skip: paginate ? (query.page - 1) * query.limit : undefined,
                take: paginate ? query.limit : undefined,
            });
            if (paginate) {
                return (0, response_1.sendPaginated)(res, result.data, query.page, query.limit, result.total);
            }
            return (0, response_1.sendSuccess)(res, result.data);
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const specialty = await specialty_service_1.specialtyService.getById(req.params.id);
            return (0, response_1.sendSuccess)(res, specialty);
        }
        catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const parsed = specialty_validator_1.createSpecialtySchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const specialty = await specialty_service_1.specialtyService.create(parsed.data);
            return (0, response_1.sendSuccess)(res, specialty, 'Specialty created', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const parsed = specialty_validator_1.updateSpecialtySchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const specialty = await specialty_service_1.specialtyService.update(req.params.id, parsed.data);
            return (0, response_1.sendSuccess)(res, specialty, 'Specialty updated');
        }
        catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            await specialty_service_1.specialtyService.delete(req.params.id);
            return (0, response_1.sendSuccess)(res, null, 'Specialty deleted');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SpecialtyController = SpecialtyController;
exports.specialtyController = new SpecialtyController();
//# sourceMappingURL=specialty.controller.js.map