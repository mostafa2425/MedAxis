import { Router } from 'express';
import { operationController } from '../controllers/operation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadMultiple } from '../middlewares/upload';

const router = Router();

router.get('/', authMiddleware, operationController.getAll.bind(operationController));
router.get('/:id', authMiddleware, operationController.getById.bind(operationController));
router.get('/:id/timeline', authMiddleware, operationController.getTimeline.bind(operationController));
router.post('/', authMiddleware, operationController.create.bind(operationController));
router.put('/:id', authMiddleware, operationController.update.bind(operationController));
router.patch('/:id/status', authMiddleware, operationController.updateStatus.bind(operationController));
router.put('/:id/cost', authMiddleware, operationController.updateCost.bind(operationController));
router.post('/:id/files', authMiddleware, uploadMultiple, operationController.uploadFiles.bind(operationController));
router.delete('/:operationId/files/:fileId', authMiddleware, operationController.deleteFile.bind(operationController));
router.delete('/:id', authMiddleware, operationController.delete.bind(operationController));

export default router;
