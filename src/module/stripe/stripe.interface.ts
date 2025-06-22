import { Types } from "mongoose";
export type TCheckout = {
  carId: string;
  vendorId: string;
  orderId: string;
  amount: number;
};

export interface IPaymentIntent {
  orderId: string;
  amount: number;
  currency: string;
}

export interface IWebhooks {
  sig: string;
  rawbody: Buffer;
}

export interface IPayment {
  orderId: Types.ObjectId;
  amount: number;
  currency: string;
  status: string;
  method: string;
  paymentIntentId: string;
}
