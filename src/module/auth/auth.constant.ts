import { Types } from "mongoose";
import { TRole } from "../../types/express";

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

export interface IVerifyForgotPassword {
  email: string;
  otp: string;
  newPassword: string;
};

export interface IUpdateUserPassword {
  userId: Types.ObjectId;
  password: string;
  newPassword: string;
};
