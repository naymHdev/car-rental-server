import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IOrder } from "../order/order.interface";

export interface IPayment {
  // _id ?: Types.ObjectId;
  // orderId: Types.ObjectId;
  // userId: Types.ObjectId;
  // subTotal?: number;
  // discount?: number;
  // total: number;
  // payStatus: boolean;
  // updatedAt: Date;
  // isDeleted: boolean;
  // tranId: string;
  // isPaid: boolean;
  _id?: Types.ObjectId;
  user: Types.ObjectId | IUser;
  order: Types.ObjectId | IOrder;
  total_amount: number;
  tranId: string;
  isPaid: boolean;
  isDeleted: boolean;
}
