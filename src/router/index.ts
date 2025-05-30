import HealthRouter from '../module/health/health.routes';
import express from 'express';

const router = express.Router()

const moduleRoutes = [
    { path: '/health', route: HealthRouter },

]

moduleRoutes.forEach((r) => router.use(r.path, r.route))
export default router