import httpStatus from "http-status";
import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import sendResponse from "../../utility/sendResponse";
import GenericService from "../../utility/genericService.helpers";
import User from "./user.model";
import { IUser } from "./user.interface";
import { idConverter } from "../../utility/idConverter";
import UserServices from "./user.services";

const getUser: RequestHandler = catchAsync(async (req, res) => {
  const { userId } = req.body.data;
  console.log("carId: ", userId.toString());

  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required", "");
  }
  const result = await GenericService.findResources<IUser>(
    User,
    await idConverter(userId)
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve user data",
    data: result,
  });
});

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await GenericService.findAllResources<IUser>(User, req.query, [
    "email",
    "userName",
    "sub",
  ]);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve users",
    data: result,
  });
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated", "");
  }
  const userId = req.user?._id;
  console.log("userId: ", userId.toString());

  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "userId is required", "");
  }
  req.body.data.userId = userId;
  const result = await UserServices.updateUserService(req.body.data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully updated user profile",
    data: result,
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated", "");
  }
  const admin = req.user?._id;
  console.log("userId: ", admin.toString());

  if (!admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin ID is required", "");
  }
  req.body.data.admin = admin;
  const userId = await idConverter(req.body.data.userId);
  const result = await GenericService.deleteResources<IUser>(User, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully deleted user",
    data: result,
  });
});

const UserController = {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
};

export default UserController;
