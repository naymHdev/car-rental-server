import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AuthServices from "./auth.services";
import httpStatus from "http-status";
import config from "../../app/config";
import sendResponse from "../../utility/sendResponse";

const signUp: RequestHandler = catchAsync(async (req, res) => {
  const { role } = req.body.data;

  // if (!email || !password) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields", "");
  // }
  const result = await AuthServices.signUpService(req.body.data);
  console.log("register: ", result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: `${role} is registered successfully`,
    data: result,
  });
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.loginService(req.body.data);
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
  const { email } = req.body.data || {};
  // if (!role || !Object.keys(roleModels).includes(role)) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing role", "");
  // }

  // const QueryModel = roleModels[role as TRole];
  const result = await AuthServices.requestForgotPasswordService(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP sent to your email",
    data: result,
  });
});

const verifyForgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyForgotPasswordService(req.body.data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

const updateUserPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.updateUserPasswordService(
    req.body.data,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password updated successfully",
    data: result,
  });
});

const AuthController = {
  signUp,
  login,
  requestForgotPassword,
  verifyForgotPassword,
  updateUserPassword,
};

export default AuthController;
