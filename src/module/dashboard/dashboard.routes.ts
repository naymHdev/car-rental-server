import { Router } from 'express';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get('/db-status', DashboardController.dashboardStatus);

export const DashboardRoutes = router;
