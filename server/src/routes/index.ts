import { Router } from 'express';
import authRoutes from './auth.routes';
import specialtyRoutes from './specialty.routes';
import hospitalRoutes from './hospital.routes';
import doctorRoutes from './doctor.routes';
import patientRoutes from './patient.routes';
import operationRoutes from './operation.routes';
import dashboardRoutes from './dashboard.routes';
import exportRoutes from './export.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/operations', operationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/export', exportRoutes);

export default router;
