import { ISignup } from "../auth/auth.interface";

export interface IUser extends ISignup {
  photo: string;
  authProvider: boolean;
  passwordUPdatedAt: Date;
  isDeleted: boolean;
}
