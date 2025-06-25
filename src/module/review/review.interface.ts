import { Types } from "mongoose";

export interface IReview {
  carId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: string;
  price: number;
  safety: number;
  accessibility: number;
  services: number;
  entertainment: number;
  support: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TReview = Partial<IReview> & {
  userId: string;
  orderId: string;
};
