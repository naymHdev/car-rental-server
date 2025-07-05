import httpStatus from "http-status";
import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/sendResponse";
import { otpServices } from "./otp.service";

const verifyOtp = catchAsync(async (req, res) => {
  const authHeader = req?.headers?.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  const result = await otpServices.verifyOtp(token as string, req.body.otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const result = await otpServices.resendOtp(req?.body?.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent successfully",
    data: result,
  });
});

export const otpController = { verifyOtp, resendOtp };
