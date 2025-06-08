import { Types } from "mongoose";

export type TSignin = {
  sub: string;
  email: string;
  password?: string;
};

export type TSignup = TSignin & {
  name: string;
};

export type TForgotPassword = {
  email: string;
};

export type TVerifyForgotPassword = {
  email: string;
  otp: string;
  newPassword: string;
};

export type TUpdateUserPassword = {
  userId: Types.ObjectId;
  password: string;
  newPassword: string;
};
