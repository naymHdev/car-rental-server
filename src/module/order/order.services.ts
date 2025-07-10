import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { IOrder, TOrder, TOrderStatus } from "./order.interface";
import Car from "../car/car.model";
import { idConverter } from "../../utility/idConverter";
import { dayCount } from "../../utility/dayCount.utils";
// import Insurance from "../insurance/insurance.model";
// import GenericService from "../../utility/genericService.helpers";
// import { IInsurance } from "../insurance/insurance.interface";
import Order from "./order.model";
import QueryBuilder from "../../app/builder/QueryBuilder";

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

  // Insurance check
  // if (addExtra.insurance && !insuranceId) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Insurance ID required if insurance is selected"
  //   );
  // }
  // const { insurance } = await GenericService.findResources<IInsurance>(
  //   Insurance,
  //   insuranceId!
  // );

  // addOnTotal += insurance.price;

  payload.subTotal = baseRent + addOnTotal;
  const validDiscount = typeof discount === "number" ? discount : 0;
  payload.total = payload.subTotal - validDiscount;

  payload.status = "inProgress";

  const newOrder = await Order.create(payload);

  if (newOrder) {
    await Car.findOneAndUpdate(
      {
        _id: await idConverter(carId),
      },
      {
        $push: {
          carPicDates: {
            pickUp: newOrder.pickUp,
            dropOff: newOrder.dropOff,
          },
        },
      }
    );
  }

  if (newOrder) {
    await Car.findOneAndUpdate(
      { _id: await idConverter(carId) },
      { $set: { isRented: true } },
      { new: true }
    );
  }

  if (!newOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order not placed yet");
  }
  return { order: newOrder, car: car };
};

const orderStatuaServices = async (payload: TOrderStatus) => {
  const { orderId, userId, ...restData } = payload;

  if (!orderId || !userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing orderId/userid fields");
  }

  const foundOrder = await Order.findById(await idConverter(orderId));
  if (!foundOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  Object.assign(foundOrder, restData);
  foundOrder.save();

  return { order: foundOrder };
};

const findAllMyOrders = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const { ...oQuery } = query;

  const baseQuery = Order.find({ userId: await idConverter(userId) })
    .populate("carId")
    .populate("userId");

  const allOrderQuery = new QueryBuilder(baseQuery, oQuery)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await allOrderQuery.modelQuery;
  const meta = await allOrderQuery.countTotal();

  return { meta, orders: result };
};

const findOrderDEtails = async (orderId: string) => {
  const order = await Order.findById(await idConverter(orderId))
    .populate({
      path: "carId",
      populate: {
        path: "vendor",
        model: "User",
      },
    })
    .populate("userId");

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  return { order };
};

const updateOrder = async (orderId: string, payload: IOrder) => {
  console.log("payload: ", payload);

  const order = await Order.findById(await idConverter(orderId));

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  Object.assign(order, payload);
  order.save();
  return { order };
};

const OrderServices = {
  createOrderServices,
  orderStatuaServices,
  findAllMyOrders,
  findOrderDEtails,
  updateOrder,
};
export default OrderServices;
