import { IUser } from "../user/user.interface";

export interface IVendor extends IUser {
  companyName: string;
}
