import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, dashboardController.getStats.bind(dashboardController));
router.get('/overview', authMiddleware, dashboardController.getOverview.bind(dashboardController));
router.get('/recent-operations', authMiddleware, dashboardController.getRecentOperations.bind(dashboardController));
router.get('/specialty-distribution', authMiddleware, dashboardController.getSpecialtyDistribution.bind(dashboardController));
router.get('/monthly-trends', authMiddleware, dashboardController.getMonthlyTrends.bind(dashboardController));
router.get('/revenue', authMiddleware, dashboardController.getRevenue.bind(dashboardController));

export default router;
