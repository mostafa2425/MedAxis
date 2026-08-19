import { Router } from 'express';
import { assistantController } from '../controllers/assistant.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/brief', authMiddleware, assistantController.getBrief.bind(assistantController));
router.get('/notifications', authMiddleware, assistantController.listNotifications.bind(assistantController));
router.patch('/notifications/:id/read', authMiddleware, assistantController.markNotificationRead.bind(assistantController));
// Development-only helper for manually testing notification persistence and push delivery.
router.post('/notifications/test', authMiddleware, assistantController.testNotification.bind(assistantController));
router.get('/cron/daily', assistantController.cronDaily.bind(assistantController));
router.get('/cron/weekly', assistantController.cronWeekly.bind(assistantController));

export default router;
