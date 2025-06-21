import { model, Model, Schema } from "mongoose";
import { IInsurance } from "./insurance.interface";
import MongooseHelper from "../../utility/mongoose.helpers";

const InsuranceSchema = new Schema<IInsurance>(
  {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

MongooseHelper.findExistence<IInsurance>(InsuranceSchema);
MongooseHelper.applyToJSONTransform(InsuranceSchema);

const Insurance: Model<IInsurance> = model<IInsurance>(
  "Insurance",
  InsuranceSchema
);
export default Insurance;
