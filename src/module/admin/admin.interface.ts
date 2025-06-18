import { Document } from "mongoose";
import { IUser } from "../user/user.interface";
import { TRole } from "../../types/express";

export interface IAdmin
  extends Omit<IUser, "firstName" | "lastName" | "location"> {
  role: TRole;
}
export interface IRecentActivity extends Document {
  title: string;
}

export interface IReport extends Document {
  title: string;
}

export type TAdminUpdate = Partial<IAdmin> & {
  adminId: string;
};
