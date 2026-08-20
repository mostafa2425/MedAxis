import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload';

const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.get('/me', authMiddleware, authController.getMe.bind(authController));
router.put('/me', authMiddleware, authController.updateMe.bind(authController));

// Keep the avatar endpoint explicitly registered on the same auth router used by /api.
// Profile images are uploaded as multipart/form-data with the `file` field.
router.post('/me/avatar', authMiddleware, uploadSingle, authController.uploadAvatar.bind(authController));

export default router;
