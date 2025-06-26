import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import Review from "./review.model";
import { IReview } from "./review.interface";
import Car from "../car/car.model";

// const addReviewService = async (payload: TReview) => {
//   const { userId, carId, ...restFields } = payload;
//   const userIdObject = await idConverter(userId);
//   // const orderIdObject = await idConverter(orderId);
//   const carIdObject = await idConverter(carId);
//    await GenericService.findResources<ICar>(Car, carIdObject);

//   await GenericService.findResources<IUser>(User, userIdObject);

//   // await GenericService.findResources<IOrder>(Order);

//   const newReview = await Review.create({
//     userId: userIdObject,
//     carId: carIdObject,
//     // orderId: orderIdObject,
//     ...restFields,
//   });

//   if (!newReview) {
//     throw new AppError(httpStatus.NOT_FOUND, `Review added failed`);
//   }

//   await Car.findByIdAndUpdate(carIdObject, {
//     $push: {
//       reviews: newReview._id,
//     },
//   })

//   return {
//     success: true,
//     message: "Review added and associated with car successfully",
//     review: newReview,
//   };
// };

const addReviewService = async (payload: IReview) => {
  const result = await Review.create(payload);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, `Your review not posted!`);
  }

  if (result) {
    const carId = result.carId;
    await Car.findOneAndUpdate(
      carId,
      { $push: { reviews: result._id } },
      { new: true }
    );
  }

  return result;
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
