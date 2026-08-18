import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { pushService } from '../services/push.service';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/public-key', (_req, res) => {
  return sendSuccess(res, { publicKey: process.env.VAPID_PUBLIC_KEY || null });
});

router.post('/subscribe', authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const subscription = req.body?.subscription;
    if (!userId || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({ success: false, message: 'A valid push subscription is required' });
    }
    await pushService.subscribe(userId, subscription, req.get('user-agent'));
    return sendSuccess(res, { subscribed: true }, 'Push notifications enabled');
  } catch (error) { next(error); }
});

router.post('/unsubscribe', authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const endpoint = req.body?.endpoint;
    if (!userId || !endpoint) return res.status(400).json({ success: false, message: 'Push endpoint is required' });
    await pushService.unsubscribe(userId, endpoint);
    return sendSuccess(res, { subscribed: false }, 'Push notifications disabled');
  } catch (error) { next(error); }
});

export default router;
