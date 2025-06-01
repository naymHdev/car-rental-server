import { model, Schema, Model } from "mongoose";
import { IPayment } from "./payment.interface";
import MongooseHelper from "../../utility/mongoose.helpers";

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subTotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentOption: {
      type: String,
      enum: ["creditCard", "paypal", "applePay"],
      required: true,
    },
    payStatus: { type: Boolean, required: true },

    updatedAt: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
MongooseHelper.applyToJSONTransform(PaymentSchema);
MongooseHelper.findExistence(PaymentSchema);

const Payment: Model<IPayment> = model<IPayment>("Payment", PaymentSchema);

export default Payment;
