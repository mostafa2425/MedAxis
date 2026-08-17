"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const response_1 = require("../utils/response");
class DashboardController {
    async getStats(req, res, next) {
        try {
            const userId = req.user?.userId;
            const stats = await dashboard_service_1.dashboardService.getStats(userId);
            return (0, response_1.sendSuccess)(res, stats);
        }
        catch (err) {
            next(err);
        }
    }
    async getRecentOperations(req, res, next) {
        try {
            const userId = req.user?.userId;
            const limit = parseInt(req.query.limit) || 10;
            const operations = await dashboard_service_1.dashboardService.getRecentOperations(userId, limit);
            return (0, response_1.sendSuccess)(res, operations);
        }
        catch (err) {
            next(err);
        }
    }
    async getSpecialtyDistribution(req, res, next) {
        try {
            const userId = req.user?.userId;
            const distribution = await dashboard_service_1.dashboardService.getSpecialtyDistribution(userId);
            return (0, response_1.sendSuccess)(res, distribution);
        }
        catch (err) {
            next(err);
        }
    }
    async getMonthlyTrends(req, res, next) {
        try {
            const userId = req.user?.userId;
            const months = parseInt(req.query.months) || 12;
            const trends = await dashboard_service_1.dashboardService.getMonthlyTrends(userId, months);
            return (0, response_1.sendSuccess)(res, trends);
        }
        catch (err) {
            next(err);
        }
    }
    async getRevenue(req, res, next) {
        try {
            const userId = req.user?.userId;
            const revenue = await dashboard_service_1.dashboardService.getRevenue(userId);
            return (0, response_1.sendSuccess)(res, revenue);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map