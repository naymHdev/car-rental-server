import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import MongooseHelper from "../../utility/mongoose.helpers";
import { Role } from "../auth/auth.interface";

// Helpers
const isRequiredForManual = function (this: IUser): boolean {
  return !this.isAuthProvider;
};

const isRequiredForSocial = function (this: IUser): boolean {
  return this.isAuthProvider;
};

// Schema
export const UserSchema: Schema = new Schema<IUser>(
  {
    // Social auth fields
    sub: {
      type: String,
      required: isRequiredForSocial,
    },
    authProviderName: {
      type: String,
      required: isRequiredForSocial,
    },

    // Manual registration fields
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
      type: String,
      required: isRequiredForManual,
    },

    // Common fields
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
      type: String,
    },
    isAuthProvider: {
      type: Boolean,
      required: [true, "Declare if this is an auth provider user or not"],
      default: false, // You can set to true if most users are from social login
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
