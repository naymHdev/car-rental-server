import AuthRouter from "../module/auth/auth.routes";
import HealthRouter from "../module/health/health.routes";
import express from "express";

const router = express.Router();

const moduleRoutes = [
  { path: "/health", route: HealthRouter },
  { path: "/auth", route: AuthRouter },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));
export default router;
