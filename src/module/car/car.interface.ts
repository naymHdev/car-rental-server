import { IUser } from "../user/user.interface";
import { Types } from "mongoose";

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

export interface ICar {
  vendor: Types.ObjectId;
  carName: string;
  description: string;
  model: string;
  mileage: IMileage;
  seat: number;
  door: number;
  vin: string;
  fuel: number;
  fuelType: string[];
  gearType: string;
  bodyStyle: string[];
  carImage: string[];
  childSeat: IPriceOption;
  additionalDriver: IPriceOption;
  youngDriver: IPriceOption;
  oneWayFees: IPriceOption;
  gps: IPriceOption;
  crossBorder: IPriceOption;
  draft: boolean;
  published: boolean;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface ICarUpdate extends ICar {
  carId: Types.ObjectId;
}

export type TCarUpdate = Partial<ICar> & { carId: string; vendor: string };
