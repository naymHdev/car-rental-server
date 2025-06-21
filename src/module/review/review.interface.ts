import { Types } from "mongoose";

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
