"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nurse_controller_1 = require("../controllers/nurse.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, nurse_controller_1.nurseController.getAll.bind(nurse_controller_1.nurseController));
router.get('/active', auth_middleware_1.authMiddleware, nurse_controller_1.nurseController.getActive.bind(nurse_controller_1.nurseController));
router.get('/:id', auth_middleware_1.authMiddleware, nurse_controller_1.nurseController.getById.bind(nurse_controller_1.nurseController));
router.post('/', auth_middleware_1.authMiddleware, nurse_controller_1.nurseController.create.bind(nurse_controller_1.nurseController));
router.put('/:id', auth_middleware_1.authMiddleware, nurse_controller_1.nurseController.update.bind(nurse_controller_1.nurseController));
router.delete('/:id', auth_middleware_1.authMiddleware, nurse_controller_1.nurseController.delete.bind(nurse_controller_1.nurseController));
exports.default = router;
//# sourceMappingURL=nurse.routes.js.map