"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const specialty_controller_1 = require("../controllers/specialty.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.get('/', specialty_controller_1.specialtyController.getAll.bind(specialty_controller_1.specialtyController));
router.get('/:id', specialty_controller_1.specialtyController.getById.bind(specialty_controller_1.specialtyController));
router.post('/', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('admin'), specialty_controller_1.specialtyController.create.bind(specialty_controller_1.specialtyController));
router.put('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('admin'), specialty_controller_1.specialtyController.update.bind(specialty_controller_1.specialtyController));
router.delete('/:id', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)('admin'), specialty_controller_1.specialtyController.delete.bind(specialty_controller_1.specialtyController));
exports.default = router;
//# sourceMappingURL=specialty.routes.js.map