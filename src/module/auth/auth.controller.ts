import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AuthServices from "./auth.services";
import httpStatus from "http-status";
import config from "../../app/config";
import sendResponse from "../../utility/sendResponse";
import NotificationServices from "../notification/notification.service";
import AppError from "../../app/error/AppError";

const signUp: RequestHandler = catchAsync(async (req, res) => {
  const { role } = req.body.data;
  const result = await AuthServices.signUpService(req.body.data);
  // console.log("register: ", result);

  if (!result.signUp || !result.signUp._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }

  await NotificationServices.sendNoification({
    ownerId: result.signUp._id!,
    key: "notification",
    data: {
      id: result.signUp?._id.toString(),
      message: `New user register`,
    },
    receiverId: [result.signUp._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: `${role} is registered successfully`,
    data: { result },
  });
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.loginService(req.body.data);
  // console.log(req.body.data!);

  const { refreshToken, accessToken, user } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  if (!user || !user._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }

  await NotificationServices.sendNoification({
    ownerId: user._id,
    key: "notification",
    data: {
      id: result.user?._id.toString(),
      message: `User/vendor login`,
    },
    receiverId: [user._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Login",
    data: {
      accessToken,
      user: user,
    },
  });
});

const fagotPassword = catchAsync(async (req, res) => {
  // console.log("req.body: ", req.body.email);
  const result = await AuthServices.forgotPassword(req?.body?.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "An OTP sent to your email!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const authHeader = req?.headers?.authorization;
  const token = authHeader?.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : authHeader;


  const result = await AuthServices.resetPassword(token as string, req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

const AuthController = {
  signUp,
  login,
  fagotPassword,
  resetPassword,
};

export default AuthController;
