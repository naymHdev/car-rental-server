import AuthRouter from "../module/auth/auth.routes";
import BlogRouter from "../module/blog/blog.routes";
import CarRouter from "../module/car/car.routes";
import HealthRouter from "../module/health/health.routes";
import express from "express";
import UserRouter from "../module/user/user.routes";
import VendorRouter from "../module/vendor/vendor.routes";
import AdminRouter from "../module/admin/admin.routes";
import ReviewRouter from "../module/review/review.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/health", route: HealthRouter },
  { path: "/auth", route: AuthRouter },
  { path: "/user", route: UserRouter },
  { path: "/vendor", route: VendorRouter },
  { path: "/admin", route: AdminRouter },
  { path: "/car", route: CarRouter },
  { path: "/blog", route: BlogRouter },
  { path: "/review", route: ReviewRouter },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));
export default router;
