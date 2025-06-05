import { Model } from "mongoose";
import { TRole } from "../types/express";
import User from "../module/user/user.model";
import Vendor from "../module/vendor/vendor.model";
import Admin from "../module/admin/admin.model";
import { IUser } from "../module/user/user.interface";
import { IVendor } from "../module/vendor/vendor.interface";
import { IAdmin } from "../module/admin/admin.interface";

export const getRoleModels = (role: TRole): Model<IAdmin | IVendor | IUser> => {
  const roleModels: Partial<Record<TRole, Model<IVendor | IUser | IAdmin>>> = {
    User: User as Model<IUser | IVendor | IAdmin>,
    Vendor: Vendor as Model<IUser | IVendor | IAdmin>,
    Admin: Admin as Model<IUser | IVendor | IAdmin>,
  };
  return roleModels[role]!;
};
