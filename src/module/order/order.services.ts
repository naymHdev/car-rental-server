import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { TOrder } from "./order.interface";
import Car from "../car/car.model";
import { idConverter } from "../../utility/idConverter";
import { dayCount } from "../../utility/dayCount.utils";
import Insurance from "../insurance/insurance.model";
import GenericService from "../../utility/genericService.helpers";
import { IInsurance } from "../insurance/insurance.interface";
import Order from "./order.model";

const createOrderServices = async (payload: TOrder) => {
  const {
    carId,
    userId,
    pickUp,
    dropOff,
    addExtra = {},
    discount,
    pickUpLocation,
    dropOffLocation,
    insuranceId,
  } = payload;

  if (
    !carId ||
    !userId ||
    !pickUp ||
    !dropOff ||
    !pickUpLocation ||
    !dropOffLocation
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

  const car = await Car.findById(await idConverter(carId));
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  const rentalDays = dayCount(pickUp, dropOff);

  const baseRent = car.price * rentalDays;

  let addOnTotal = 0;
  if (addExtra.childSeat)
    addOnTotal += car.childSeat.price * car.childSeat.select;
  if (addExtra.additionalDriver)
    addOnTotal += car.additionalDriver.price * car.additionalDriver.select;
  if (addExtra.youngDriver)
    addOnTotal += car.youngDriver.price * car.youngDriver.select;
  if (addExtra.oneWayFees)
    addOnTotal += car.oneWayFees.price * car.oneWayFees.select;
  if (addExtra.gps) addOnTotal += car.gps.price * car.gps.select;
  if (addExtra.crossBorder)
    addOnTotal += car.crossBorder.price * car.crossBorder.select;

  // 🛡 Insurance check
  if (addExtra.insurance && !insuranceId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Insurance ID required if insurance is selected"
    );
  }
  const { insurance } = await GenericService.findResources<IInsurance>(
    Insurance,
    insuranceId!
  );

  addOnTotal += insurance.price;

  payload.subTotal = baseRent + addOnTotal;
  payload.total = payload.subTotal - discount!;

  payload.status = "inProgress";

  const newOrder = await Order.create(payload);
  if (!newOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order not placed yet");
  }
  return { order: newOrder };
};

const OrderServices = {
  createOrderServices,
};
export default OrderServices;
