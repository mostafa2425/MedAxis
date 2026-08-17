"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, patient_controller_1.patientController.getAll.bind(patient_controller_1.patientController));
router.get('/:id', auth_middleware_1.authMiddleware, patient_controller_1.patientController.getById.bind(patient_controller_1.patientController));
router.post('/', auth_middleware_1.authMiddleware, patient_controller_1.patientController.create.bind(patient_controller_1.patientController));
router.put('/:id', auth_middleware_1.authMiddleware, patient_controller_1.patientController.update.bind(patient_controller_1.patientController));
router.delete('/:id', auth_middleware_1.authMiddleware, patient_controller_1.patientController.delete.bind(patient_controller_1.patientController));
exports.default = router;
//# sourceMappingURL=patient.routes.js.map