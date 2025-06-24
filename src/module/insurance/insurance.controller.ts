import httpStatus from "http-status";
import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import sendResponse from "../../utility/sendResponse";
import GenericService from "../../utility/genericService.helpers";
import { idConverter } from "../../utility/idConverter";
import { IInsurance } from "./insurance.interface";
import Insurance from "./insurance.model";
import InsuranceServices from "./insurance.services";
import NotificationServices from "../notification/notification.service";

const createInsurance: RequestHandler = catchAsync(async (req, res) => {
  if (req.user?.role !== "Admin") {
    throw new AppError(httpStatus.BAD_REQUEST, "Insurance ID is required", "");
  }
  const result = await InsuranceServices.createInsuranceService(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: req.user?._id,
    key: "notification",
    data: {
      id: result.insurance?._id.toString(),
      message: `New insurance added`,
    },
    receiverId: [req.user?._id],
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully added new insurance",
    data: result,
  });
});

const getInsurance: RequestHandler = catchAsync(async (req, res) => {
  const { insuranceId } = req.body.data;
  console.log("insuranceId: ", insuranceId);

  if (!insuranceId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insurance ID is required", "");
  }
  const result = await GenericService.findResources<IInsurance>(
    Insurance,
    await idConverter(insuranceId)
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve all insurance data",
    data: result,
  });
});

const getAllInsurance: RequestHandler = catchAsync(async (req, res) => {
  const result = await GenericService.findAllResources<IInsurance>(
    Insurance,
    req.query,
    ["title", "price"]
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve Insurance data",
    data: result,
  });
});

const updateInsurance: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Admin not authenticated", "");
  }
  const result = await InsuranceServices.updateInsuranceService(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: req.user?._id,
    key: "notification",
    data: {
      id: result.insurance?._id.toString(),
      message: `An insurance updated`,
    },
    receiverId: [req.user?._id],
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully updated insurance ",
    data: result,
  });
});

const deleteInsurance: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Vendor not authenticated", "");
  }

  if (req.user?.role !== "Admin") {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Only admin can do update insurance",
      ""
    );
  }
  const { insuranceId } = req.body.data;
  const result = await GenericService.deleteResources<IInsurance>(
    Insurance,
    await idConverter(insuranceId)
  );

  await NotificationServices.sendNoification({
    ownerId: req.user?._id,
    key: "notification",
    data: {
      message: `An insurance deleted`,
    },
    receiverId: [req.user?._id],
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully deleted insurance",
    data: result,
  });
});

const InsuranceController = {
  createInsurance,
  getInsurance,
  getAllInsurance,
  updateInsurance,
  deleteInsurance,
};

export default InsuranceController;
