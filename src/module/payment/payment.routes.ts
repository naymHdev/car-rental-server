import { Router } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middleware/auth";
import { ERole } from "../auth/auth.interface";

const router = Router();

router.post(
  "/make_payment",
  auth(ERole.USER, ERole.VENDOR),
  PaymentController.makePayment
);

export const PaymentRoutes = router;
