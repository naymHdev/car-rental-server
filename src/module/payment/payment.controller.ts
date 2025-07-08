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
    message: "payment successful",
  });
});

export const PaymentController = {
  confirmPayment,
};
