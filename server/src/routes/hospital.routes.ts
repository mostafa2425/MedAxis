import { Router } from 'express';
import { hospitalController } from '../controllers/hospital.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, hospitalController.getAll.bind(hospitalController));
router.get('/active', authMiddleware, hospitalController.getActive.bind(hospitalController));
router.get('/:id', authMiddleware, hospitalController.getById.bind(hospitalController));
router.post('/', authMiddleware, hospitalController.create.bind(hospitalController));
router.put('/:id', authMiddleware, hospitalController.update.bind(hospitalController));
router.delete('/:id', authMiddleware, hospitalController.delete.bind(hospitalController));

export default router;
