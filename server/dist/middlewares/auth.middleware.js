"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const auth_1 = require("../utils/auth");
const errors_1 = require("../utils/errors");
const user_repo_1 = require("../repositories/user.repo");
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, auth_1.verifyToken)(token);
        const user = await user_repo_1.userRepo.findById(decoded.userId);
        if (!user || !user.isActive) {
            throw new errors_1.UnauthorizedError('User not found or inactive');
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err instanceof errors_1.UnauthorizedError) {
            next(err);
        }
        else {
            next(new errors_1.UnauthorizedError('Invalid or expired token'));
        }
    }
}
//# sourceMappingURL=auth.middleware.js.map