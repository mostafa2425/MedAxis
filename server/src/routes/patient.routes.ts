import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, patientController.getAll.bind(patientController));
router.get('/:id', authMiddleware, patientController.getById.bind(patientController));
router.post('/', authMiddleware, patientController.create.bind(patientController));
router.put('/:id', authMiddleware, patientController.update.bind(patientController));
router.delete('/:id', authMiddleware, patientController.delete.bind(patientController));

export default router;
