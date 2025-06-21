import { Types } from "mongoose";

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
  insuranceId?: Types.ObjectId;
  pickUp: Date;
  dropOff: Date;
  pickUpLocation: string;
  dropOffLocation: string;
  addExtra: AddExtra;
  subTotal: number;
  discount: number;
  total: number;
  status: "accept" | "cancel" | "complete" | "inProgress";
  updatedAt: Date;
  createdAt: Date;
  isDeleted: boolean;
}

export type TOrder = Partial<IOrder>;

export interface IOrderUPdate extends IOrder {
  orderId: Types.ObjectId;
}
