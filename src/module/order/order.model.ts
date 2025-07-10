import { model, Schema, Model } from "mongoose";
import { AddExtra, IOrder } from "./order.interface";
import MongooseHelper from "../../utility/mongoose.helpers";

const AddExtraSchema = new Schema<AddExtra>(
  {
    childSeat: {
      type: Boolean,
      required: false,
    },
    additionalDriver: {
      type: Boolean,
      required: false,
    },
    youngDriver: {
      type: Boolean,
      required: false,
    },
    oneWayFees: {
      type: Boolean,
      required: false,
    },
    gps: {
      type: Boolean,
      required: false,
    },
    crossBorder: {
      type: Boolean,
      required: false,
    },
    insurance: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const OrderSchema: Schema = new Schema<IOrder>(
  {
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    insuranceId: {
      type: Schema.Types.ObjectId,
      ref: "Insurance",
      required: function (this: IOrder) {
        return !!this.addExtra.insurance;
      },
    },
    pickUp: { type: Date, required: true },
    dropOff: { type: Date, required: true },
    pickUpLocation: { type: String, required: true },
    dropOffLocation: { type: String, required: true },
    addExtra: { type: AddExtraSchema, required: false, default: {} },
    discount: { type: Number, default: 0 },
    subTotal: { type: Number, required: true },
    total: {
      type: Number,
      default: function (this: IOrder): number {
        return this.subTotal - this.discount;
      },
    },

    status: {
      type: String,
      enum: ["accept", "cancel", "complete", "inProgress"],
      required: true,
      default: "inProgress",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MongooseHelper.applyToJSONTransform(OrderSchema);
MongooseHelper.findExistence(OrderSchema);

const Order: Model<IOrder> = model<IOrder>("Order", OrderSchema);

export default Order;
