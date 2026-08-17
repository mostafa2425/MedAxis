"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hospital_controller_1 = require("../controllers/hospital.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, hospital_controller_1.hospitalController.getAll.bind(hospital_controller_1.hospitalController));
router.get('/active', auth_middleware_1.authMiddleware, hospital_controller_1.hospitalController.getActive.bind(hospital_controller_1.hospitalController));
router.get('/:id', auth_middleware_1.authMiddleware, hospital_controller_1.hospitalController.getById.bind(hospital_controller_1.hospitalController));
router.post('/', auth_middleware_1.authMiddleware, hospital_controller_1.hospitalController.create.bind(hospital_controller_1.hospitalController));
router.put('/:id', auth_middleware_1.authMiddleware, hospital_controller_1.hospitalController.update.bind(hospital_controller_1.hospitalController));
router.delete('/:id', auth_middleware_1.authMiddleware, hospital_controller_1.hospitalController.delete.bind(hospital_controller_1.hospitalController));
exports.default = router;
//# sourceMappingURL=hospital.routes.js.map