"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const errors_1 = require("../utils/errors");
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errors_1.ForbiddenError('Not authenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.ForbiddenError('Insufficient permissions'));
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map