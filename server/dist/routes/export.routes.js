"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const export_controller_1 = require("../controllers/export.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/operations', auth_middleware_1.authMiddleware, export_controller_1.exportController.exportOperations.bind(export_controller_1.exportController));
exports.default = router;
//# sourceMappingURL=export.routes.js.map