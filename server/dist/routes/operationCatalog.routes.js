"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const operationCatalog_controller_1 = require("../controllers/operationCatalog.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, operationCatalog_controller_1.operationCatalogController.getAll.bind(operationCatalog_controller_1.operationCatalogController));
router.post('/', auth_middleware_1.authMiddleware, operationCatalog_controller_1.operationCatalogController.create.bind(operationCatalog_controller_1.operationCatalogController));
exports.default = router;
//# sourceMappingURL=operationCatalog.routes.js.map