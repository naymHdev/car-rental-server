import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import GenericService from "../../utility/genericService.helpers";
import { idConverter } from "../../utility/idConverter";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import {  TReview } from "./review.interface";
import Review from "./review.model";
import Order from "../order/order.model";
import { IOrder } from "../order/order.interface";

const addReviewService = async (payload: TReview) => {
  const { userId, orderId, ...restFields } = payload;
  const userIdObject = await idConverter(userId);
  const orderIdObject = await idConverter(orderId);

  await GenericService.findResources<IUser>(User, userIdObject);

  await GenericService.findResources<IOrder>(Order, orderIdObject);

  const newReview = await Review.create({
    userId: userIdObject,
    orderId: orderIdObject,
    ...restFields,
  });

  if (!newReview) {
    throw new AppError(httpStatus.NOT_FOUND, `Review added failed`);
  }
  return { review: newReview };
};

const ReviewServices = {
  addReviewService,
};
export default ReviewServices;
