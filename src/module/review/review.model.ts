import { model, Schema, Model } from "mongoose";
import { IReview } from "./review.interface";
import MongooseHelper from "../../utility/mongoose.helpers";

const ReviewSchema: Schema = new Schema<IReview>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      ref: "Order",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    safety: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    accessibility: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    services: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    entertainment: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    support: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

MongooseHelper.applyToJSONTransform(ReviewSchema);
MongooseHelper.findExistence(ReviewSchema);

const Review: Model<IReview> = model<IReview>("Review", ReviewSchema);

export default Review;
