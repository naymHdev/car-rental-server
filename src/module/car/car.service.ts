import AppError from "../../app/error/AppError";
import { ICar, TCarUpdate } from "./car.interface";
import httpStatus from "http-status";
import Car from "./car.model";
import { idConverter } from "../../utility/idConverter";
import QueryBuilder from "../../app/builder/QueryBuilder";
import Review from "../review/review.model";
import mongoose from "mongoose";

const addNewCarIntoDbService = async (payload: ICar) => {
  const { vendor } = payload;

  payload.published = true;
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor id is required");
  }
  const newCar = await Car.create(payload);
  if (!newCar) {
    throw new AppError(httpStatus.NOT_FOUND, "New car add failed");
  }
  return { car: newCar };
};

const findCarIntoDbService = async (carId: string) => {
  const carIdObject = await idConverter(carId);
  const foundCar = await Car.findById(carIdObject)
    .populate("vendor")
    .populate("reviews");

  if (foundCar?.published === false) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Car is not published yet by vendor!"
    );
  }

  if (!foundCar) {
    throw new AppError(httpStatus.NOT_FOUND, "No car has found");
  }
  return { car: foundCar };
};
const singleCarReview = async (carId: string) => {
  const carObjectId = new mongoose.Types.ObjectId(carId);

  const reviewStats = await Review.aggregate([
    { $match: { carId: carObjectId } },
    {
      $group: {
        _id: "$carId",
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
        overallRating: {
          $round: [
            {
              $avg: [
                "$avgPrice",
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

  return reviewStats[0];
};

const findAllCarIntoDbService = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice, ...cQuery } = query;

  const baseQuery = Car.find({ published: true })
    .populate("vendor")
    .populate("reviews");

  const allCarQuery = new QueryBuilder(baseQuery, cQuery)
    .search(["model", "fuelType", "rentingLocation"])
    .filter()
    .sort()
    .pagination()
    .fields()
    .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

  const cars = await allCarQuery.modelQuery;
  const meta = await allCarQuery.countTotal();

  return { meta: meta, car: cars };
};

const updateCarIntoDbService = async (payload: TCarUpdate, carId: string) => {
  const carIdObject = await idConverter(carId);

  // console.log("payload___", payload);

  const updateCar = await Car.findByIdAndUpdate(
    carIdObject,
    { ...payload },
    { new: true, runValidators: true }
  );

  if (!updateCar) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update the car"
    );
  }

  return updateCar;
};

const deleteCarIntoDbService = async (carId: string, vendor: string) => {
  if (!carId || !vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Car id & vendor id is required");
  }

  const findCar = await Car.findById(carId);

  if (findCar?.vendor.toString() !== vendor.toString()) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Vendor does not match the car's vendor"
    );
  }

  const updatedCar = await Car.findByIdAndUpdate(
    carId,
    { published: false, isDeleted: true },
    { new: true }
  );

  if (!updatedCar) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to unpublish the car"
    );
  }

  return { message: `Car with ID ${carId} deleted successfully` };
};

//  --------- For filters car API's  ----------
const getAllLocations = async () => {
  const result = await Car.aggregate([
    {
      $group: {
        _id: "$rentingLocation.city",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        title: "$_id",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return result;
};

const getCarBrands = async () => {
  const result = await Car.aggregate([
    {
      $group: {
        _id: "$brand",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        title: "$_id",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return result;
};

const getCarTypes = async () => {
  const result = await Car.aggregate([
    {
      $group: {
        _id: "$model",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        title: "$_id",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Add "All" manually with total sum
  // const total = result.reduce((acc, cur) => acc + cur.count, 0);
  // result.unshift({ fuelType: "All", count: total });

  return result;
};

const getCarFuelTypes = async () => {
  const result = await Car.aggregate([
    {
      $unwind: "$fuelType",
    },
    {
      $group: {
        _id: "$fuelType",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        title: "$_id",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return result;
};

const singleCarReviews = async (carId: string) => {
  const car = await Car.findById(carId);

  if (!car || !car.reviews) {
    throw new AppError(httpStatus.NOT_FOUND, "No reviews found for this car");
  }

  const reviews = await Review.find({ _id: { $in: car.reviews } })
    .populate("carId")
    .populate("userId")
    .populate("orderId");

  return reviews;
};

const getMyCar = async (userId: string, query: Record<string, unknown>) => {
  const { ...cQuery } = query;

  const baseQuery = Car.find({ vendor: userId, published: true })
    .populate("vendor")
    .populate("reviews");

  const allCarQuery = new QueryBuilder(baseQuery, cQuery)
    .search([
      "model",
      "fuelType",
      "rentingLocation.city",
      "carName",
      "carAmenities",
    ])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await allCarQuery.modelQuery;
  const meta = await allCarQuery.countTotal();

  return { meta, cars: result };
};

const CarService = {
  addNewCarIntoDbService,
  findCarIntoDbService,
  findAllCarIntoDbService,
  updateCarIntoDbService,
  deleteCarIntoDbService,
  getAllLocations,
  getCarBrands,
  getCarTypes,
  getCarFuelTypes,
  singleCarReview,
  singleCarReviews,
  getMyCar,
};

export default CarService;
