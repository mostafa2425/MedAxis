import { Router } from 'express';
import { exportController } from '../controllers/export.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/operations', authMiddleware, exportController.exportOperations.bind(exportController));

export default router;
