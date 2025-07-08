import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utility/sendResponse";
import GenericService from "../../utility/genericService.helpers";
import { idConverter } from "../../utility/idConverter";
import NotificationServices from "../notification/notification.service";
import OrderServices from "./order.services";
import { IOrder } from "./order.interface";
import Order from "./order.model";

const addOrder: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user._id;

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required", "");
  }

  req.body.data.userId = await idConverter(user);
  const result = await OrderServices.createOrderServices(req.body.data);

  // console.log("result: ", result);

  await NotificationServices.sendNoification({
    ownerId: req.body.data.userId,
    key: "notification",
    data: {
      id: result.order?._id.toString(),
      message: `New order added`,
    },
    receiverId: [req.body.data.userId, result.car.vendor],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully new order added",
    data: result,
  });
});

const findOrder: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.query;
  console.log("orderId: ", id!);

  if (!id || typeof id !== "string") {
    throw new AppError(httpStatus.BAD_REQUEST, "ID is required", "");
  }
  const result = await GenericService.findResources<IOrder>(
    Order,
    await idConverter(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve order data",
    data: result,
  });
});

const findAllOrder: RequestHandler = catchAsync(async (req, res) => {
  const result = await GenericService.findAllResources<IOrder>(
    Order,
    req.query,
    []
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve all order data",
    data: result,
  });
});

const updateOrder: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated", "");
  }
  const user = req.user?._id;
  const { status } = req.body.data;
  console.log("userId: ", user);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required", "");
  }
  req.body.data.userId = await idConverter(user);
  const result = await OrderServices.orderStatuaServices(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: req.body.data.userId,
    key: "notification",
    data: {
      id: result.order?._id.toString(),
      message: `Order info updated to ${status}`,
    },
    receiverId: [req.body.data.vendor],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: `successfully updated to ${status}`,
    data: result,
  });
});

const findMyOrders = catchAsync(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not logged in.");
  }

  const result = await OrderServices.findAllMyOrders(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully retrieve all order data",
    data: result,
  });
});

const orderDetails = catchAsync(async (req, res) => {
  const result = await OrderServices.findOrderDEtails(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully retrieve all order data",
    data: result,
  });
});

const OrderController = {
  addOrder,
  findOrder,
  findAllOrder,
  updateOrder,
  findMyOrders,
  orderDetails,
};

export default OrderController;
