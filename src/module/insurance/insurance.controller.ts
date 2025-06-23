import httpStatus from "http-status";
import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import sendResponse from "../../utility/sendResponse";
import GenericService from "../../utility/genericService.helpers";
import { idConverter } from "../../utility/idConverter";
import { IInsurance } from "./insurance.interface";
import { emitMessageToAdmin } from "../../utility/socket.helpers";
import Insurance from "./insurance.model";
import InsuranceServices from "./insurance.services";

const createInsurance: RequestHandler = catchAsync(async (req, res) => {
  if (req.user?.role !== "Admin") {
    throw new AppError(httpStatus.BAD_REQUEST, "Insurance ID is required", "");
  }
  const result = await InsuranceServices.createInsuranceService(req.body.data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve insurance data",
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
    message: "successfully retrieve insurance data",
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
    message: "successfully retrieve Insurance",
    data: result,
  });
});

const updateInsurance: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Admin not authenticated", "");
  }
  const result = await InsuranceServices.updateInsuranceService(req.body.data);

  emitMessageToAdmin("update_insurance", {
    message: `vendorId:${result.insurance._id.toString()} updated successfully`,
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

  emitMessageToAdmin("delete_insurance", {
    message: `A insurance deleted successfully`,
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
