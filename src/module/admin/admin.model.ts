import { Model, Schema } from "mongoose";
import MongooseHelper from "../../utility/mongoose.helpers";
import { IAdmin } from "./admin.interface";
import User from "../user/user.model";

const AdminSchema = new Schema({}, { timestamps: true });

MongooseHelper.excludeFields(
  AdminSchema,
  ["firstName", "lastName", "location"],
  "Admin"
);
MongooseHelper.applyToJSONTransform(AdminSchema);
const Admin: Model<IAdmin> = User.discriminator<IAdmin>("Admin", AdminSchema);
export default Admin;
