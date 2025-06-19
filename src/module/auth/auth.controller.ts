import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AuthServices from "./auth.services";
import httpStatus from "http-status";
import config from "../../app/config";
import sendResponse from "../../utility/sendResponse";
import { emitMessage } from "../../utility/socket.helpers";

const signUp: RequestHandler = catchAsync(async (req, res) => {
  const { role } = req.body.data;

  // if (!email || !password) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields", "");
  // }
  const result = await AuthServices.signUpService(req.body.data);
  console.log("register: ", result);

  emitMessage("signUp", {
    message: `Id:${result.signUp?._id.toString} signedup successfully`,
  });
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
  emitMessage("login", {
    message: `Id:${result.user?._id.toString} login successfully`,
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
  const result = await AuthServices.requestForgotPasswordService(email);

  emitMessage("sent_otp", {
    message: `On ${result.email} otp sent successfully`,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `OTP sent to your email:${email}`,
    data: result,
  });
});

const verifyOtp: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyOtpService(req.body.data);

  emitMessage("verify_otp", {
    message: `On ${result.user._id} otp verified successfully`,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Otp verified successfully",
    data: result,
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPasswordService(req.body.data);
  emitMessage("reset_password", {
    message: `User:${result.user._id.toString()} password reset successfully`,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password updated successfully",
    data: result,
  });
});
const updatePassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.updatePasswordService(req.body.data);
  emitMessage("update_password", {
    message: `User:${result.user._id.toString()} password update successfully`,
  });
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
  verifyOtp,
  resetPassword,
  updatePassword,
};

export default AuthController;
