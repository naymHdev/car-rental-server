import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import httpStatus from "http-status";
import CarService from "./car.service";
import sendResponse from "../../utility/sendResponse";
import { idConverter } from "../../utility/idConverter";
import NotificationServices from "../notification/notification.service";

const addNewCar: RequestHandler = catchAsync(async (req, res) => {
  const vendor = req.user._id;

  if (!vendor) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor ID is required", "");
  }

  req.body.data.vendor = await idConverter(vendor);
  const result = await CarService.addNewCarIntoDbService(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: req.body.data.vendor,
    key: "notification",
    data: {
      id: result.car?._id.toString(),
      message: `New car added`,
    },
    receiverId: [req.body.data.vendor],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve car data",
    data: result,
  });
});

const findCar: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarService.findCarIntoDbService(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve car data",
    data: result,
  });
});

const singleCarReview = catchAsync(async (req, res) => {
  const result = await CarService.singleCarReview(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve single car average review!",
    data: result,
  });
});

const findAllCar: RequestHandler = catchAsync(async (req, res) => {
  const result = await CarService.findAllCarIntoDbService(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve car data",
    data: result,
  });
});

const updateCar: RequestHandler = catchAsync(async (req, res) => {
  const vendor = req.user?._id;
  const carId = req.params.id;

  if (!vendor) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor ID is required", "");
  }
  req.body.data.vendor = vendor;
  const result = await CarService.updateCarIntoDbService(req.body.data, carId);

  // await NotificationServices.sendNoification({
  //   ownerId: req.body.data.vendor,
  //   key: "notification",
  //   data: {
  //     id: result.car?._id.toString(),
  //     message: `Car info updated`,
  //   },
  //   receiverId: [req.body.data.vendor],
  //   notifyAdmin: true,
  // });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully updated car",
    data: result,
  });
});

const deleteCar: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authenticated",
      ""
    );
  }

  const result = await CarService.deleteCarIntoDbService(
    req.params.id,
    req.user._id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully deleted a car",
    data: result,
  });
});

// --------------------- For filters Car API's  ---------------------

const getAllLocations = catchAsync(async (req, res) => {
  const result = await CarService.getAllLocations();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve locations data",
    data: result,
  });
});

const getCarBrands = catchAsync(async (req, res) => {
  const result = await CarService.getCarBrands();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve car brands data",
    data: result,
  });
});

const getCarTypes = catchAsync(async (req, res) => {
  const result = await CarService.getCarTypes();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve car types data",
    data: result,
  });
});

const getFuelTypes = catchAsync(async (req, res) => {
  const result = await CarService.getCarFuelTypes();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully retrieve fuel types data",
    data: result,
  });
});

const getSingleCarReviews = catchAsync(async (req, res) => {
  const result = await CarService.singleCarReviews(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve single car reviews!",
    data: result,
  });
});

const getMyCars = catchAsync(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required", "");
  }

  const result = await CarService.getMyCar(userId.toString(), req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully retrieve my cars!",
    data: result,
  });
});

const CarController = {
  addNewCar,
  findCar,
  findAllCar,
  updateCar,
  deleteCar,
  getAllLocations,
  getCarBrands,
  getCarTypes,
  getFuelTypes,
  singleCarReview,
  getSingleCarReviews,
  getMyCars,
};

export default CarController;
