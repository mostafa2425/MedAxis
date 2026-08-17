"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, doctor_controller_1.doctorController.getAll.bind(doctor_controller_1.doctorController));
router.get('/active', auth_middleware_1.authMiddleware, doctor_controller_1.doctorController.getActive.bind(doctor_controller_1.doctorController));
router.get('/:id', auth_middleware_1.authMiddleware, doctor_controller_1.doctorController.getById.bind(doctor_controller_1.doctorController));
router.post('/', auth_middleware_1.authMiddleware, doctor_controller_1.doctorController.create.bind(doctor_controller_1.doctorController));
router.put('/:id', auth_middleware_1.authMiddleware, doctor_controller_1.doctorController.update.bind(doctor_controller_1.doctorController));
router.delete('/:id', auth_middleware_1.authMiddleware, doctor_controller_1.doctorController.delete.bind(doctor_controller_1.doctorController));
exports.default = router;
//# sourceMappingURL=doctor.routes.js.map