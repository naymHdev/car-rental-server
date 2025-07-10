import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IOrder } from "../order/order.interface";

export interface IPayment {
  _id?: Types.ObjectId;
  user: Types.ObjectId | IUser;
  order: Types.ObjectId | IOrder;
  total_amount: number;
  tranId: string;
  isPaid: boolean;
  isDeleted: boolean;
}
