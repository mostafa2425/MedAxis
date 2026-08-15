import { Router } from 'express';
import { operationCatalogController } from '../controllers/operationCatalog.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, operationCatalogController.getAll.bind(operationCatalogController));
router.post('/', authMiddleware, operationCatalogController.create.bind(operationCatalogController));

export default router;
