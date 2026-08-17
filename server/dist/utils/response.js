"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
exports.sendPaginated = sendPaginated;
function sendSuccess(res, data, message = 'Success', statusCode = 200, meta) {
    const response = {
        success: true,
        message,
        ...(data !== undefined && { data }),
        ...(meta && { meta }),
    };
    return res.status(statusCode).json(response);
}
function sendError(res, message, statusCode = 500, errors) {
    const response = {
        success: false,
        message,
        ...(errors != null && { data: errors }),
    };
    return res.status(statusCode).json(response);
}
function sendPaginated(res, data, page, limit, total, message = 'Success') {
    return sendSuccess(res, data, message, 200, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}
//# sourceMappingURL=response.js.map