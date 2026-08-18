import { Router } from 'express';
import { assistantController } from '../controllers/assistant.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/brief', authMiddleware, assistantController.getBrief.bind(assistantController));

export default router;
