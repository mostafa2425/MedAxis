"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const auth_validator_1 = require("../validators/auth.validator");
const errors_1 = require("../utils/errors");
class AuthController {
    async login(req, res, next) {
        try {
            const parsed = auth_validator_1.loginSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const result = await auth_service_1.authService.login(parsed.data.email, parsed.data.password);
            return (0, response_1.sendSuccess)(res, result, 'Login successful');
        }
        catch (err) {
            next(err);
        }
    }
    async register(req, res, next) {
        try {
            const parsed = auth_validator_1.registerSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const result = await auth_service_1.authService.register(parsed.data.email, parsed.data.password, parsed.data.name, parsed.data.specialtyIds, parsed.data.phone, parsed.data.subspecialtyIds);
            return (0, response_1.sendSuccess)(res, result, 'Registration successful', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async getMe(req, res, next) {
        try {
            const userId = req.user?.userId;
            const user = await auth_service_1.authService.getMe(userId);
            return (0, response_1.sendSuccess)(res, user);
        }
        catch (err) {
            next(err);
        }
    }
    async updateMe(req, res, next) {
        try {
            const parsed = auth_validator_1.updateProfileSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new errors_1.AppError(parsed.error.issues[0]?.message || 'Validation error', 400, parsed.error.issues);
            }
            const userId = req.user?.userId;
            const user = await auth_service_1.authService.updateProfile(userId, parsed.data);
            return (0, response_1.sendSuccess)(res, user, 'Profile updated');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map