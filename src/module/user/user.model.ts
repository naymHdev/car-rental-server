import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import MongooseHelper from "../../utility/mongoose.helpers";
import { Role } from "../../types/express";

export const UserSchema: Schema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: function (this: IUser): boolean {
        return !this.isAuthProvider;
      },
    },
    role: {
      type: String,
      enum: Role,
      required: [true, "Role is required"],
    },
    photo: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    authProvider: {
      type: [
        {
          sub: {
            type: String,
            required: function (this: IUser): boolean {
              return !this.isAuthProvider;
            },
          },
          authProviderName: {
            type: String,
            required: function (this: IUser): boolean {
              return !this.isAuthProvider;
            },
          },
        },
      ],
      required: function (this: IUser): boolean {
        return !this.isAuthProvider;
      },
    },
    passwordUpdatedAt: {
      type: Date,
      default: Date.now(),
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
