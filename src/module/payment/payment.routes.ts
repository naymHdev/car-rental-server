import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();
router.get("/confirm-payment", PaymentController.confirmPayment);

router.get("/all-payments", PaymentController.getAllPayments);

router.get("/payment-details/:id", PaymentController.getPaymentDetails);

router.delete("/delete-payment/:id", PaymentController.deletePayment);

export const PaymentRoutes = router;
