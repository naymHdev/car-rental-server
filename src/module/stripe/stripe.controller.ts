import httpStatus from "http-status";
import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import StripeServices from "./stripe.service";
import sendResponse from "../../utility/sendResponse";
import { handleStripeWebhook } from "./stripe.webhook";
import stripe from "../../app/config/stripe.config";
import NotificationServices from "../notification/notification.service";
import { idConverter } from "../../utility/idConverter";

const createPaymentIntent: RequestHandler = catchAsync(async (req, res) => {
  const { amount, currency } = req.body.data;
  if (!amount || !currency) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Missing data of amount or currency"
    );
  }
  const result = await StripeServices.createPaymentIntentService(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: await idConverter(req.body.data.userId),
    key: "notification",
    data: {
      message: `Payment done`,
    },
    receiverId: [await idConverter(req.body.data.userId)],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully payment complete",
    data: result,
  });
});

const webhook: RequestHandler = catchAsync(async (req, res) => {
  const result = handleStripeWebhook({
    sig: req.headers["stripe-signature"] as string,
    rawbody: req.body,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "success",
    data: result,
  });
});

export const createCheckoutSession: RequestHandler = catchAsync(
  async (req, res) => {
    const { amount, orderId } = req.body.data;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount * 100,
            product_data: {
              name: "Car Rental Payment",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: orderId,
      },
      success_url: "",
      cancel_url: "",
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "success",
      data: { url: session.url },
    });
  }
);

const StripeController = {
  createPaymentIntent,
  webhook,
  createCheckoutSession,
};
export default StripeController;
