import httpStatus from "http-status";
import catchAsync from "../../utility/catchAsync";
import { PaymentServices } from "./payment.service";
import sendResponse from "../../utility/sendResponse";
import config from "../../app/config";

const confirmPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.confirmPayment(req?.query);
  res.redirect(
    `${config.stripe.client_Url}${config.stripe.success_url}?orderId=${result?.order}&paymentId=${result?._id}`
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "payment confirm successful",
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.getAllPayments(req?.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "payment get all successful",
  });
});

const getPaymentDetails = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentDetails(req?.params?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "payment details get successful",
  });
});

const deletePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.deletePayment(req?.params?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "payment delete successful",
  });
});

export const PaymentController = {
  confirmPayment,
  getAllPayments,
  getPaymentDetails,
  deletePayment,
};
