import AuthRouter from "../module/auth/auth.routes";
import BlogRouter from "../module/blog/blog.routes";
import CarRouter from "../module/car/car.routes";
import HealthRouter from "../module/health/health.routes";
import express from "express";

const router = express.Router();

const moduleRoutes = [
  { path: "/health", route: HealthRouter },
  { path: "/auth", route: AuthRouter },
  { path: "/car", route: CarRouter },
  { path: "/blog", route: BlogRouter },

];

moduleRoutes.forEach((r) => router.use(r.path, r.route));
export default router;
