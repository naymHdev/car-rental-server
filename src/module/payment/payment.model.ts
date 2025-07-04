import { model, Schema, Model } from "mongoose";
import MongooseHelper from "../../utility/mongoose.helpers";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentOption: {
      type: String,
      enum: ["creditCard", "paypal", "applePay"],
      required: true,
    },
  },
  { timestamps: true }
);

MongooseHelper.applyToJSONTransform(PaymentSchema);
MongooseHelper.findExistence(PaymentSchema);

export const Payment: Model<IPayment> = model<IPayment>(
  "Payment",
  PaymentSchema
);
