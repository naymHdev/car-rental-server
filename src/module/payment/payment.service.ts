import httpStatus from "http-status";
import Stripe from "stripe";
import { Payment } from "./payment.model";
import config from "../../app/config";
import { IOrder } from "../order/order.interface";
import { startSession, Types } from "mongoose";
import Order from "../order/order.model";
import AppError from "../../app/error/AppError";
import { createCheckoutSession } from "./payment.utils";
import User from "../user/user.model";
import { IUser } from "../user/user.interface";
import generateRandomString from "../../utility/generateRandomString";
import QueryBuilder from "../../app/builder/QueryBuilder";

const stripe = new Stripe(config.stripe?.secretKey as string, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

interface IIorder extends IOrder {
  _id: Types.ObjectId;
}

//-----------------create acheck out url---------------------
const checkout = async (
  payload: IIorder,
  userId: string,
  product_names: string
) => {
  const order: IIorder | null = await Order.findById(payload?._id);

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order Not Found!");
  }

  const createTranId = generateRandomString(10);

  const createdPayment = await Payment.create({
    user: userId,
    tranId: createTranId,
    total_amount: order?.total,
    order: order?._id,
  });

  if (!createdPayment) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create payment"
    );
  }

  const checkoutSession = await createCheckoutSession({
    // customerId: customer.id,
    product: {
      amount: order?.total,
      name: product_names,
      quantity: 1,
    },

    paymentId: createdPayment?._id,
  });

  return checkoutSession?.url;
};

const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query; 
  const session = await startSession();
  const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId);
  const paymentIntentId = PaymentSession.payment_intent as string;

  if (PaymentSession.status !== "complete") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment session is not completed"
    );
  }

  try {
    session.startTransaction();

    const payment = (await Payment.findByIdAndUpdate(
      paymentId,
      { isPaid: true, paymentIntentId: paymentIntentId },
      { new: true, session }
    ).populate("user")) as unknown as {
      _id: string;
      order: string;
      tranId: string;
      total_amount: number;
      createdAt: Date;
      user: IUser;
    };

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found!");
    }

    // check user is exist or not
    const user = await User.findById(payment?.user).session(session);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
    }

    const order: IIorder | null = await Order.findById(payment?.order).session(
      session
    );

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order Not Found!");
    }

    await Order.findByIdAndUpdate(
      payment?.order,
      {
        isPaid: true,
      },
      {
        session,
      }
    );

    await session.commitTransaction();
    return payment;
  } catch (error: any) {
    await session.abortTransaction();

    if (paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
        });
      } catch (refundError: any) {
        console.error("Error processing refund:", refundError.message);
      }
    }

    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const { ...mQuery } = query;
  const baseQuery = Payment.find().populate("user").populate("order");

  const paymentsQuery = new QueryBuilder(baseQuery, mQuery)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const payments = await paymentsQuery.modelQuery;
  const meta = await paymentsQuery.countTotal();

  return { meta, payments };
};

const getPaymentDetails = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId)
    .populate("user")
    .populate("order")
    .populate({
      path: "order",
      populate: [{ path: "carId" }, { path: "userId" }],
    });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found!");
  }
  return payment;
};

const deletePayment = async (paymentId: string) => {
  const payment = await Payment.findByIdAndDelete(paymentId);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found!");
  }
  return payment;
};

export const PaymentServices = {
  checkout,
  confirmPayment,
  getAllPayments,
  getPaymentDetails,
  deletePayment,
};
