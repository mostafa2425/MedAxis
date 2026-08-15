import { Router } from 'express';
import { nurseController } from '../controllers/nurse.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, nurseController.getAll.bind(nurseController));
router.get('/active', authMiddleware, nurseController.getActive.bind(nurseController));
router.get('/:id', authMiddleware, nurseController.getById.bind(nurseController));
router.post('/', authMiddleware, nurseController.create.bind(nurseController));
router.put('/:id', authMiddleware, nurseController.update.bind(nurseController));
router.delete('/:id', authMiddleware, nurseController.delete.bind(nurseController));

export default router;
