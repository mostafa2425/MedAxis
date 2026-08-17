"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportController = exports.ExportController = void 0;
const export_service_1 = require("../services/export.service");
const export_validator_1 = require("../validators/export.validator");
class ExportController {
    async exportOperations(req, res, next) {
        try {
            const parsed = export_validator_1.exportQuerySchema.safeParse(req.query);
            const params = parsed.success
                ? parsed.data
                : { format: 'json' };
            const userId = req.user?.userId;
            const result = await export_service_1.exportService.exportOperations({
                ...params,
                status: params.status,
                createdBy: userId,
            });
            if (result.format === 'csv' && result.data) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
                return res.send(result.data);
            }
            return res.json({
                success: true,
                message: 'Export successful',
                data: result.data,
                meta: { totalRecords: result.totalRecords },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ExportController = ExportController;
exports.exportController = new ExportController();
//# sourceMappingURL=export.controller.js.map