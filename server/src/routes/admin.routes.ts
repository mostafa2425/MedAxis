import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { adminController } from '../controllers/admin.controller';

const router = Router();
router.use(authMiddleware, requireRole('admin'));
router.get('/overview', adminController.overview);
router.get('/users', adminController.users);
router.patch('/users/:id', adminController.updateUser);
router.get('/doctors', adminController.doctors);
router.patch('/doctors/:id', adminController.updateDoctor);
router.get('/patients', adminController.patients);
router.get('/hospitals', adminController.hospitals);
router.patch('/hospitals/:id', adminController.updateHospital);
router.get('/operations', adminController.operations);
router.get('/analytics', adminController.analytics);
router.get('/audit-logs', adminController.auditLogs);
export default router;
