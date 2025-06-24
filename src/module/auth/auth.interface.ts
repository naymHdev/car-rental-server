import { Types } from "mongoose";
import { TRole } from "../../types/express";

export const Role = ["User", "Vendor", "Admin"] as const;

export interface ILocation {
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  zipCode: string;
}

// export interface IAuthProvider extends Document {
//   sub: string;
//   authProviderName: string;
// }
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
  photo: string;
  role: TRole;
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
