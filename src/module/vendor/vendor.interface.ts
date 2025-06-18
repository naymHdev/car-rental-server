import { IUser } from "../user/user.interface";

export interface IVendor extends IUser {
  companyName: string;
}

export type TVendorUpdate = Partial<IVendor> & {
  vendorId: string;
};
