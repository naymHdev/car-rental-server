import { model, Schema, Model } from "mongoose";
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
      required: false,
    },
    discount: {
      type: Number,
      required: false,
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

// MongooseHelper.applyToJSONTransform(PaymentSchema);
// MongooseHelper.findExistence(PaymentSchema);

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
