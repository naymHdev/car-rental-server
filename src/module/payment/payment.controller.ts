import httpStatus from "http-status";
import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/sendResponse";
import { PaymentServices } from "./payment.service";
import AppError from "../../app/error/AppError";

const makePayment = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required", "");
  }

  const result = await PaymentServices.makePayment(userId, req.body.data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully created payment",
    data: result,
  });
});

export const PaymentController = {
  makePayment,
};
