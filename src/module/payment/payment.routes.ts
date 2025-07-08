import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();
router.get('/confirm-payment', PaymentController.confirmPayment);

export const PaymentRoutes = router;
