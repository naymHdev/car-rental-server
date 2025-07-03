import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import MongooseHelper from "../../utility/mongoose.helpers";
import { ILocation, Role } from "../auth/auth.interface";

export const LocationSchema = new Schema<ILocation>(
  {
    country: { type: String, required: true, trim: true },
    state: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    streetAddress: { type: String, required: false, trim: true },
    zipCode: { type: String, required: false, trim: true },
  },
  { _id: false }
);

// Helpers
const isRequiredForManual = function (this: IUser): boolean {
  return !this.sub;
};

const isRequiredForSocial = function (this: IUser): boolean {
  return !!this.sub;
};

// Schema
export const UserSchema: Schema = new Schema<IUser>(
  {
    sub: {
      type: String,
      required: false,
    },
    authProviderName: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: isRequiredForManual,
    },
    lastName: {
      type: String,
      required: isRequiredForManual,
    },
    userName: {
      type: String,
      required: isRequiredForManual,
    },
    password: {
      type: String,
      required: isRequiredForManual,
    },
    mobile: {
      type: String,
      required: isRequiredForManual,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    role: {
      type: String,
      enum: Role,
      required: [true, "Role is required"],
    },
    photo: {
      type: [String],
      required: false,
    },
    isAuthProvider: {
      type: Boolean,
      required: [
        isRequiredForSocial,
        "Declare if this is an auth provider user or not",
      ],
      default: isRequiredForSocial,
    },
    passwordUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Attach Mongoose Helpers
MongooseHelper.preSaveHashPassword(UserSchema);
MongooseHelper.comparePasswordIntoDb(UserSchema);
MongooseHelper.findExistence<IUser>(UserSchema);
MongooseHelper.applyToJSONTransform(UserSchema);

// Export Model
const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;
