import { idConverter } from "./../../utility/idConverter";
import httpStatus from "http-status";
import stripe from "../../app/config/stripe.config";
import { IWebhooks } from "./stripe.interface";
import config from "../../app/config";
import AppError from "../../app/error/AppError";
import Stripe from "stripe";
import Order from "../order/order.model";
import Payment from "../payment/payment.model";

export const handleStripeWebhook = async (payload: IWebhooks) => {
  const { rawbody, sig } = payload;
  const event = stripe.webhooks.constructEvent(
    rawbody,
    sig!,
    config.stripe.webHookSecret!
  );
  if (!event || event.type !== "payment_intent.succeeded") {
    throw new AppError(httpStatus.NOT_FOUND, "not webhook event have found");
  }
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata.orderId;
  const updateOrderStatus = await Order.findByIdAndUpdate(
    await idConverter(orderId),
    { status: "accept" },
    { new: true }
  );
  if (!updateOrderStatus) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Order status not updated to accept due to some issue"
    );
  }

  const newPayment = await Payment.create({
    orderId: await idConverter(orderId),
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    method: paymentIntent.payment_method,
    paymentIntentId: paymentIntent.id,
  });

  if (!newPayment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not stored on database");
  }

  return { payment: newPayment };
};
