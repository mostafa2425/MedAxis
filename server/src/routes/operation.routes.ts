import { Router } from 'express';
import { operationController } from '../controllers/operation.controller';
import { operationFollowUpController } from '../controllers/operationFollowUp.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadOperationFiles } from '../middlewares/upload';

const router = Router();

router.get('/', authMiddleware, operationController.getAll.bind(operationController));
router.get('/follow-ups', authMiddleware, operationFollowUpController.listAll.bind(operationFollowUpController));
router.get('/:id', authMiddleware, operationController.getById.bind(operationController));
router.get('/:id/timeline', authMiddleware, operationController.getTimeline.bind(operationController));
router.get('/:id/follow-ups', authMiddleware, operationFollowUpController.list.bind(operationFollowUpController));
router.post('/:id/follow-ups', authMiddleware, operationFollowUpController.create.bind(operationFollowUpController));
router.patch('/:id/follow-ups/:followUpId', authMiddleware, operationFollowUpController.update.bind(operationFollowUpController));
router.delete('/:id/follow-ups/:followUpId', authMiddleware, operationFollowUpController.remove.bind(operationFollowUpController));
router.get('/:operationId/files/:fileId/download', authMiddleware, operationController.downloadFile.bind(operationController));
router.post('/', authMiddleware, operationController.create.bind(operationController));
router.put('/:id', authMiddleware, operationController.update.bind(operationController));
router.patch('/:id/status', authMiddleware, operationController.updateStatus.bind(operationController));
router.put('/:id/cost', authMiddleware, operationController.updateCost.bind(operationController));
router.post('/:id/files/upload-url', authMiddleware, operationController.createFileUploadUrl.bind(operationController));
router.post('/:id/files/complete', authMiddleware, operationController.completeFileUpload.bind(operationController));
router.post('/:id/files', authMiddleware, uploadOperationFiles, operationController.uploadFiles.bind(operationController));
router.delete('/:operationId/files/:fileId', authMiddleware, operationController.deleteFile.bind(operationController));
router.delete('/:id', authMiddleware, operationController.delete.bind(operationController));

export default router;
