import { Router } from 'express';
import { doctorController } from '../controllers/doctor.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, doctorController.getAll.bind(doctorController));
router.get('/active', authMiddleware, doctorController.getActive.bind(doctorController));
router.get('/:id', authMiddleware, doctorController.getById.bind(doctorController));
router.post('/', authMiddleware, doctorController.create.bind(doctorController));
router.put('/:id', authMiddleware, doctorController.update.bind(doctorController));
router.delete('/:id', authMiddleware, doctorController.delete.bind(doctorController));

export default router;
