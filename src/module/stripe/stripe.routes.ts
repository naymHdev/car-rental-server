import express from "express";
import StripeController from "./stripe.controller";

const router = express.Router();

router.post(
  "/create_payment_intent",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  StripeController.createPaymentIntent
);

router.post(
  "/webhook",
  express.raw({ type: "applicaton/json" }),
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  StripeController.webhook
);
router.post(
  "/create-checkout-session",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  StripeController.createCheckoutSession
);
const StripeRouter = router;
export default StripeRouter;
