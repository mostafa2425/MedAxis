import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/', authMiddleware, async (_req, res, next) => {
  try {
    const data = await prisma.governorate.findMany({
      where: { isActive: true },
      orderBy: { nameEn: 'asc' },
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
});

export default router;
