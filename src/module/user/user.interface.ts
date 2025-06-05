import { ISignup } from "../auth/auth.interface";

export interface IUser extends ISignup {
  comparePassword(plainPassword: string): Promise<boolean>;
  passwordUpdatedAt: Date;
  isDeleted: boolean;
}
