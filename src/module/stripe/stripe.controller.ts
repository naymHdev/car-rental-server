import httpStatus from "http-status";
import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import StripeServices from "./stripe.service";
import sendResponse from "../../utility/sendResponse";
import { handleStripeWebhook } from "./stripe.webhook";

const createPaymentIntent: RequestHandler = catchAsync(async (req, res) => {
  const { amount, currency } = req.body.data;
  if (!amount || !currency) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Missing data of amount or currency"
    );
  }
  const result = await StripeServices.createPaymentIntentService(req.body.data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve user data",
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

import { Request, Response } from "express";
import stripe from "../../app/config/stripe.config"; // your Stripe instance

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { amount, orderId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "paypal"], // Apple Pay is implicit
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount * 100, // amount in cents
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

  res.status(200).json({ url: session.url });
};

const StripeController = {
  createPaymentIntent,
  webhook,
  createCheckoutSession,
};
export default StripeController;
