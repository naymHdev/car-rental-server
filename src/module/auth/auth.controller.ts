import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AuthServices from "./auth.services";
import httpStatus from "http-status";
import config from "../../app/config";
import sendResponse from "../../utility/sendResponse";
import AppError from "../../app/error/AppError";

const playerSignUp: RequestHandler = catchAsync(async (req, res) => {
  const { role } = req.body.data;

  // if (!email || !password) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields", "");
  // }
  const result = await AuthServices.signUpPlayer(req.body.data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: `${role} is registered successfully`,
    data: result,
  });
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDb(req.body.data);
  console.log(req.body.data!);

  const { refreshToken, accessToken, user } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
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

const requestForgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const { email, role } = req.body.data || {};
  if (!role || !Object.keys(roleModels).includes(role)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing role", "");
  }

  const QueryModel = roleModels[role as Role];
  const result = await AuthServices.requestForgotPassword(email, QueryModel!);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP sent to your email",
    data: result,
  });
});

const verifyForgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const { role } = req.body.data || {};
  if (!role || !Object.keys(roleModels).includes(role)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing role", "");
  }

  const QueryModel = roleModels[role as Role];
  const result = await AuthServices.verifyForgotPassword(
    req.body.data,
    QueryModel!
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

const updateUserPassword: RequestHandler = catchAsync(async (req, res) => {
  const { role } = req.body.data || {};
  if (!role || !Object.keys(roleModels).includes(role)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing role", "");
  }

  const QueryModel = roleModels[role as Role];
  const result = await AuthServices.updateUserPassword(
    req.body.data,
    QueryModel!
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password updated successfully",
    data: result,
  });
});

const AuthController = {
  login,
  requestForgotPassword,
  verifyForgotPassword,
  updateUserPassword,
  playerSignUp,
};

export default AuthController;
