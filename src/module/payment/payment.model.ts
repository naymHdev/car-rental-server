import { model, Schema, Model } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    tranId: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PaymentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

PaymentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

PaymentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Payment: Model<IPayment> = model<IPayment>(
  "Payment",
  PaymentSchema
);
