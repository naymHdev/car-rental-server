import AppError from "../../app/error/AppError";
import { ICar, TCarUpdate } from "../car/car.interface";
import httpStatus from "http-status";
import Car from "./car.model";
import { idConverter } from "../../utility/idConverter";
import QueryBuilder from "../../app/builder/QueryBuilder";

const addNewCarIntoDbService = async (payload: ICar) => {
  const { vendor } = payload;
  //   payload.draft = false;
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
  const foundCar = await Car.findById(carIdObject).populate("vendor");
  if (!foundCar) {
    throw new AppError(httpStatus.NOT_FOUND, "No car has found");
  }
  return { car: foundCar };
};

const findAllCarIntoDbService = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice, ...cQuery } = query;

  const baseQuery = Car.find().populate("vendor");
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

const updateCarIntoDbService = async (payload: TCarUpdate) => {
  const { carId, vendor, ...updateData } = payload;
  const carIdObject = await idConverter(carId);
  const vendorIdObject = await idConverter(vendor);

  if (!carIdObject || !vendorIdObject) {
    throw new AppError(httpStatus.NOT_FOUND, "Car id & vendor id is required");
  }
  const foundCar = await Car.findById(carIdObject);
  if (!foundCar) {
    throw new AppError(httpStatus.NOT_FOUND, "No car has found");
  }
  if (vendor !== foundCar.vendor.toString()) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Vendor does not match the car's vendor"
    );
  }
  Object.assign(foundCar, updateData);
  foundCar.save();
  return { car: foundCar };
};

const deleteCarIntoDbService = async (carId: string, vendor: string) => {
  const carIdObject = await idConverter(carId);
  const vendorIdObject = await idConverter(carId);

  if (!carIdObject || !vendorIdObject) {
    throw new AppError(httpStatus.NOT_FOUND, "Car id & vendor id is required");
  }
  const foundCar = await Car.findById(carIdObject);
  if (!foundCar) {
    throw new AppError(httpStatus.NOT_FOUND, "No car has found");
  }
  if (vendor !== foundCar.vendor.toString()) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Vendor does not own this car"
    );
  }
  const deleteCar = await Car.deleteOne({ _id: carIdObject });
  if (!deleteCar.deletedCount) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Car deletion failed");
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

  return result;
};

const getFiletype = async () => {
  const result = await Car.aggregate([
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

const CarService = {
  addNewCarIntoDbService,
  findCarIntoDbService,
  findAllCarIntoDbService,
  updateCarIntoDbService,
  deleteCarIntoDbService,
  getAllLocations,
  getCarBrands,
  getCarTypes,
  getFiletype,
};

export default CarService;
