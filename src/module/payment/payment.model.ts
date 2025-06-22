import { model, Schema, Model } from "mongoose";
import MongooseHelper from "../../utility/mongoose.helpers";
import { IPayment } from "../stripe/stripe.interface";

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    method: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
  },
  { timestamps: true }
);

MongooseHelper.applyToJSONTransform(PaymentSchema);
MongooseHelper.findExistence(PaymentSchema);

const Payment: Model<IPayment> = model<IPayment>("Payment", PaymentSchema);

export default Payment;
