import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:type', authMiddleware, reportsController.getReport.bind(reportsController));

export default router;
