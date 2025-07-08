import { ILocation } from "../auth/auth.interface";
import { IUser } from "../user/user.interface";
import { Types } from "mongoose";

export enum GearType {
  Manual = "Manual",
  Automatic = "Automatic",
}
export interface IVendor extends IUser {
  companyName: string;
}

export enum MileageType {
  M = "M",
  KM = "KM",
}

export interface IMileage {
  rate: number;
  type: MileageType;
}
export interface IPriceOption {
  select: number;
  price: number;
}

export interface ICarPicDates {
  pickUp: Date;
  dropOff: Date;
}

export interface ICar {
  vendor: Types.ObjectId;
  reviews?: Types.ObjectId;
  carName: string;
  model: string;
  brand: string;
  description: string;
  price: number;
  rentingLocation: ILocation;
  carAmenities: string[];
  discount: number;
  mileage: IMileage;
  seat: number;
  door: number;
  vin: string;
  fuel: number;
  fuelType: string;
  gearType: GearType;
  bodyStyle: string[];
  carImage: string[];
  childSeat: IPriceOption;
  additionalDriver: IPriceOption;
  youngDriver: IPriceOption;
  oneWayFees: IPriceOption;
  gps: IPriceOption;
  crossBorder: IPriceOption;
  published?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isRented?: boolean;
  carPicDates?: ICarPicDates[];
}

export interface ICarUpdate extends ICar {
  carId: Types.ObjectId;
}

export type TCarUpdate = Partial<ICar> & { carId: string; vendor: string };
