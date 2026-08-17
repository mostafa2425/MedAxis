"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/stats', auth_middleware_1.authMiddleware, dashboard_controller_1.dashboardController.getStats.bind(dashboard_controller_1.dashboardController));
router.get('/recent-operations', auth_middleware_1.authMiddleware, dashboard_controller_1.dashboardController.getRecentOperations.bind(dashboard_controller_1.dashboardController));
router.get('/specialty-distribution', auth_middleware_1.authMiddleware, dashboard_controller_1.dashboardController.getSpecialtyDistribution.bind(dashboard_controller_1.dashboardController));
router.get('/monthly-trends', auth_middleware_1.authMiddleware, dashboard_controller_1.dashboardController.getMonthlyTrends.bind(dashboard_controller_1.dashboardController));
router.get('/revenue', auth_middleware_1.authMiddleware, dashboard_controller_1.dashboardController.getRevenue.bind(dashboard_controller_1.dashboardController));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map