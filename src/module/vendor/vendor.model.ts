import { Model, Schema } from "mongoose";
import { IVendor } from "./vendor.interface";
import User from "../user/user.model";

const VendorSchema = new Schema(
  {
    companyName: {
      type: String,
      required: function (this: IVendor) {
        return !this.sub;
      },
    },
  },
  { timestamps: true }
);

// MongooseHelper.preSaveHashPassword(VendorSchema);

// MongooseHelper.comparePasswordIntoDb(VendorSchema);
// MongooseHelper.findExistence<IVendor>(VendorSchema);
// MongooseHelper.applyToJSONTransform(VendorSchema);

const Vendor: Model<IVendor> = User.discriminator<IVendor>(
  "Vendor",
  VendorSchema
);
export default Vendor;
