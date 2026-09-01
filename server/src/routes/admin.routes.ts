import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { adminController } from '../controllers/admin.controller';

const router = Router();

router.use(authMiddleware, requireRole('admin'));
router.get('/overview', adminController.overview);

export default router;
