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
import NotificationServices from "../notification/notification.service";
import { IJwtPayload } from "../auth/auth.interface";

const myProfile = catchAsync(async (req, res) => {
  // console.log('req.user', req.user);

  const isUser = req.user as IJwtPayload;
  const result = await UserServices.myProfile(isUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const getUser: RequestHandler = catchAsync(async (req, res) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
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
  // console.log("req.body.data: ", req.body.data);
  // console.log("req.user: ", req.user);

  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated", "");
  }

  const userId = req.user?._id;
  // console.log("userId: ", userId.toString());

  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "userId is required", "");
  }
  req.body.data.userId = userId;
  const result = await UserServices.updateUserService(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: await idConverter(req.body.data.userId),
    key: "notification",
    data: {
      id: userId,
      message: `User updated`,
    },
    receiverId: [userId],
    notifyAdmin: true,
  });

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
  // console.log("userId: ", admin.toString());

  if (!admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin ID is required", "");
  }
  req.body.data.admin = admin;
  const userId = await idConverter(req.body.data.userId);
  const result = await GenericService.deleteResources<IUser>(User, userId);

  await NotificationServices.sendNoification({
    ownerId: await idConverter(req.body.data.userId),
    key: "notification",
    data: {
      id: userId,
      message: `User deleted`,
    },
    receiverId: [userId],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully deleted user",
    data: result,
  });
});

const changePass = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated", "");
  }
  const authHeader = req?.headers?.authorization;
  const token = authHeader?.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : authHeader;

    
  const result = await UserServices.changeUserPassword(
    token as string,
    req?.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Password changed successfully",
    data: result,
  });
});

const UserController = {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  myProfile,
  changePass,
};

export default UserController;
