import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import GenericService from "../../utility/genericService.helpers";
import { idConverter } from "../../utility/idConverter";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import { TReview } from "./review.interface";
import Review from "./review.model";
import Car from "../car/car.model";
import { ICar } from "../car/car.interface";

const addReviewService = async (payload: TReview) => {
  const { userId, carId, ...restFields } = payload;
  const userIdObject = await idConverter(userId);
  // const orderIdObject = await idConverter(orderId);
  const carIdObject = await idConverter(carId);
   await GenericService.findResources<ICar>(Car, carIdObject);

  await GenericService.findResources<IUser>(User, userIdObject);

  // await GenericService.findResources<IOrder>(Order);

  const newReview = await Review.create({
    userId: userIdObject,
    carId: carIdObject,
    // orderId: orderIdObject,
    ...restFields,
  });

  if (!newReview) {
    throw new AppError(httpStatus.NOT_FOUND, `Review added failed`);
  }

  await Car.findByIdAndUpdate(carIdObject, {
    $push: {
      reviews: newReview._id,
    },
  })


  return {
    success: true,
    message: "Review added and associated with car successfully",
    review: newReview,
  };
};

const getAllReviews = async () => {
  const result = await Review.find();
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `Review not found`);
  }
  return { reviews: result };
};

const getSingleReview = async (id: string) => {
  const result = await Review.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `Review not found`);
  }
  return { reviews: result };
};

const getAverageReview = async () => {
  const result = await Review.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        avgService: { $avg: "$services" },
        avgSafety: { $avg: "$safety" },
        avgEntertainment: { $avg: "$entertainment" },
        avgAccessibility: { $avg: "$accessibility" },
        avgSupport: { $avg: "$support" },
      },
    },
    {
      $project: {
        _id: 0,
        totalReviews: 1,
        avgPrice: { $round: ["$avgPrice", 1] },
        avgService: { $round: ["$avgService", 1] },
        avgSafety: { $round: ["$avgSafety", 1] },
        avgEntertainment: { $round: ["$avgEntertainment", 1] },
        avgAccessibility: { $round: ["$avgAccessibility", 1] },
        avgSupport: { $round: ["$avgSupport", 1] },
        avgTotal: {
          $round: [
            {
              $avg: [
                "$avgService",
                "$avgSafety",
                "$avgEntertainment",
                "$avgAccessibility",
                "$avgSupport",
              ],
            },
            2,
          ],
        },
      },
    },
  ]);

  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  return {
    success: true,
    message: "Average review calculated",
    data: result[0],
  };
};

const ReviewServices = {
  addReviewService,
  getAllReviews,
  getSingleReview,
  getAverageReview,
};
export default ReviewServices;
