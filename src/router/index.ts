import AuthRouter from "../module/auth/auth.routes";
import BlogRouter from "../module/blog/blog.routes";
import CarRouter from "../module/car/car.routes";
import HealthRouter from "../module/health/health.routes";
import express from "express";
import UserRouter from "../module/user/user.routes";
import VendorRouter from "../module/vendor/vendor.routes";
import AdminRouter from "../module/admin/admin.routes";
import ReviewRouter from "../module/review/review.routes";
import InsuranceRouter from "../module/insurance/insurance.routes";
import NotificationRouter from "../module/notification/notification.routes";
import OrderRouter from "../module/order/order.routes";
import { OtpRoutes } from "../module/otp/otp.routes";
import { GetInTouchRouter } from "../module/getInTouch/getInTouch.routes";
import { DashboardRoutes } from "../module/dashboard/dashboard.routes";
import { PaymentRoutes } from "../module/payment/payment.routes";

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
  { path: "/order", route: OrderRouter },
  { path: "/insurance", route: InsuranceRouter },
  { path: "/payment", route: PaymentRoutes },
  { path: "/notification", route: NotificationRouter },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/getInTouch",
    route: GetInTouchRouter,
  },
  {
    path: "/dashboards",
    route: DashboardRoutes,
  },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));
export default router;
