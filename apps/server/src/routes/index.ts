import { Router } from 'express';
import leadRoutes from './lead.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/leads', leadRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
