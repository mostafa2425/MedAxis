import { Router } from 'express';
import authRoutes from './auth.routes';
import specialtyRoutes from './specialty.routes';
import hospitalRoutes from './hospital.routes';
import governorateRoutes from './governorate.routes';
import doctorRoutes from './doctor.routes';
import nurseRoutes from './nurse.routes';
import patientRoutes from './patient.routes';
import operationRoutes from './operation.routes';
import operationCatalogRoutes from './operationCatalog.routes';
import dashboardRoutes from './dashboard.routes';
import assistantRoutes from './assistant.routes';
import pushRoutes from './push.routes';
import exportRoutes from './export.routes';
import reportsRoutes from './reports.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/specialties', specialtyRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/governorates', governorateRoutes);
router.use('/doctors', doctorRoutes);
router.use('/nurses', nurseRoutes);
router.use('/patients', patientRoutes);
router.use('/operation-catalog', operationCatalogRoutes);
router.use('/operations', operationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/assistant', assistantRoutes);
router.use('/push', pushRoutes);
router.use('/export', exportRoutes);
router.use('/reports', reportsRoutes);
router.use('/admin', adminRoutes);

export default router;
