import { Router } from 'express';
import { specialtyController } from '../controllers/specialty.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authMiddleware, specialtyController.getAll.bind(specialtyController));
router.get('/:id', authMiddleware, specialtyController.getById.bind(specialtyController));
router.post('/', authMiddleware, requireRole('admin'), specialtyController.create.bind(specialtyController));
router.put('/:id', authMiddleware, requireRole('admin'), specialtyController.update.bind(specialtyController));
router.delete('/:id', authMiddleware, requireRole('admin'), specialtyController.delete.bind(specialtyController));

export default router;
