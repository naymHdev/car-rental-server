import httpStatus from "http-status";
import stripe from "../../app/config/stripe.config";
import AppError from "../../app/error/AppError";
import { IPaymentIntent } from "./stripe.interface";

const createPaymentIntentService = async (payload: IPaymentIntent) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: payload.amount,
    currency: payload.currency || "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId: payload.orderId,
    },
  });
  if (!paymentIntent) {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      "There is a problem on payment building"
    );
  }
  return { clientSecret: paymentIntent.client_secret };
};

const StripeServices = {
  createPaymentIntentService,
};
export default StripeServices;
