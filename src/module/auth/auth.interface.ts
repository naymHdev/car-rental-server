import { Document, Types } from "mongoose";
import { Role } from "../../types/express";

export interface ISignIn extends Document {
  sub?: string;
  email: string;
  password: string;
  role: Role;
}
export interface ISignup extends ISignIn {
  firstName: string;
  lastName: string;
  userName: string;
  mobile: string;
  location: string;
  authProviderName?: string;
}

export interface IOtp {
  userId: Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
}

export interface IUserBase extends Document {
  email: string;
  password: string;
  role: Role;
  comparePassword(plainPassword: string): Promise<boolean>;
}
