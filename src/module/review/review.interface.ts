import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface IReview {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  price: number;
  safety: number;
  accessibilty: number;
  services: number;
  entertainment: number;
  support: number;
  name: string;
  email: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TReview = Partial<IReview> & {
  userId: string;
  orderId: string;
};

export interface IVendor extends IUser {
  companyName: string;
}

// export interface Rewards {
//   code: string;
//   reward: string;
//   validity: string;
// }
export interface IMileage {
  rate: number;
  type: string;
}
export interface IPriceOption {
  select: number;
  price: number;
}
export interface AddExtra {
  childSeat?: boolean;
  additionalDriver?: boolean;
  youngDriver?: boolean;
  oneWayFees?: boolean;
  gps?: boolean;
  crossBorder?: boolean;
  insurance?: boolean;
}

export interface IOrder {
  carId: Types.ObjectId;
  userId: Types.ObjectId;
  pickUp: Date;
  dropOff: Date;
  pickUpLocation: string;
  dropOffLocation: string;
  addExtra: AddExtra;
  discount: number;
  status: "accept" | "cancel" | "complete" | "inProgress";
  updatedAt: Date;
  isDeleted: boolean;
}

export interface IOrderUPdate extends IOrder {
  orderId: Types.ObjectId;
}
