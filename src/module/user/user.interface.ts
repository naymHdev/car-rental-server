import { ISignup } from "../auth/auth.interface";

export interface IUser extends ISignup {
  passwordUpdatedAt: Date;
  isDeleted: boolean;
}
