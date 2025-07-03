import { Types } from "mongoose";
import { TRole } from "../../types/express";

export const Role = ["User", "Vendor", "Admin"] as const;

export enum ERole {
  USER = "User",
  VENDOR = "Vendor",
  ADMIN = "Admin",
}

export interface ILocation {
  country: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  zipCode?: string;
}

export interface ISignIn {
  isAuthProvider?: boolean;
  email: string;
  password?: string;
  sub?: string;
  authProviderName?: string;
  // authProvider?: IAuthProvider[];
}
export interface ISignup extends ISignIn {
  firstName?: string;
  lastName?: string;
  userName?: string;
  mobile?: string;
  location?: ILocation;
  photo: string[];
  role: ERole;
  agreeTcp: boolean;
}

export interface IOtp {
  userId: Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
}

export interface ISignUpBase extends ISignup {
  comparePassword(plainPassword: string): Promise<boolean>;
}

export interface IJwtPayload {
  _id: string;
  email: string;
  role: TRole;
  first_name: string;
  last_name: string;
  isActive: boolean;
}
