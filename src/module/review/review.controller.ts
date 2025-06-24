import httpStatus from "http-status";
import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import sendResponse from "../../utility/sendResponse";
import ReviewServices from "./review.services";
import GenericService from "../../utility/genericService.helpers";
import Review from "./review.model";
import { IReview } from "./review.interface";
import AppError from "../../app/error/AppError";
import { idConverter } from "../../utility/idConverter";
import NotificationServices from "../notification/notification.service";

const addReview: RequestHandler = catchAsync(async (req, res) => {
  const result = await ReviewServices.addReviewService(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: await idConverter(req.body.data.userId),
    key: "notification",
    data: {
      id: result.review?._id.toString(),
      message: `Add new review`,
    },
    receiverId: [await idConverter(req.body.data.userId)],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully add review data",
    data: result,
  });
});

const findReview: RequestHandler = catchAsync(async (req, res) => {
  const { reviewId } = req.body.data;
  if (!reviewId) {
    throw new AppError(httpStatus.NOT_FOUND, `ReviewId is required`);
  }
  const result = await GenericService.findResources<IReview>(
    Review,
    await idConverter(reviewId)
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve review data",
    data: result,
  });
});
const findAllReview: RequestHandler = catchAsync(async (req, res) => {
  const result = await GenericService.findAllResources<IReview>(
    Review,
    req.query,
    ["userId", "orderId"]
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retriev all review data",
    data: result,
  });
});

const ReviewController = {
  addReview,
  findReview,
  findAllReview,
};
export default ReviewController;
