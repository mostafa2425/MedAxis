"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authController.login.bind(auth_controller_1.authController));
router.post('/register', auth_controller_1.authController.register.bind(auth_controller_1.authController));
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.authController.getMe.bind(auth_controller_1.authController));
router.put('/me', auth_middleware_1.authMiddleware, auth_controller_1.authController.updateMe.bind(auth_controller_1.authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map