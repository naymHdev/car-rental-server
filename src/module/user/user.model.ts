import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import MongooseHelper from "../../utility/mongoose.helpers";
import { Role } from "../../types/express";
import { string } from "zod";

export const UserSchema: Schema = new Schema(
  {
    sub: {
      type: String,
      required: false,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: function (this: IUser): boolean {
        return !this.sub;
      },
    },
    role: {
      type: String,
      enum: Role,
      required: [true, "Role is required"],
    },
    photo: {
      type: string,
      required: false,
    },
    mobile: {
      type: string,
      required: true,
    },
    location: {
      type: string,
      required: true,
    },
    authProvider: {
      type: Boolean,
      required: function (this: IUser): boolean {
        return !!this.sub;
      },
    },
    authProviderName: {
      type: String,
      required: function (this: IUser): boolean {
        return !!this.sub;
      },
    },
    passwordUpdatedAt: {
      type: Date,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MongooseHelper.preSaveHashPassword(UserSchema);

MongooseHelper.comparePasswordIntoDb(UserSchema);
MongooseHelper.findExistence<IUser>(UserSchema);
MongooseHelper.applyToJSONTransform(UserSchema);

const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;
