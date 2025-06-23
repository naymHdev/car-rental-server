import httpStatus from "http-status";
import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import sendResponse from "../../utility/sendResponse";
import GenericService from "../../utility/genericService.helpers";
import { idConverter } from "../../utility/idConverter";
import { IVendor } from "./vendor.interface";
import Vendor from "./vendor.model";
import VendorServices from "./vendor.services";
import { emitMessage } from "../../utility/socket.helpers";

const getVendor: RequestHandler = catchAsync(async (req, res) => {
  const { VendorId } = req.body.data;
  console.log("carId: ", VendorId);

  if (!VendorId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor ID is required", "");
  }
  const result = await GenericService.findResources<IVendor>(
    VendorId,
    await idConverter(VendorId)
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve Vendor data",
    data: result,
  });
});

const getAllVendor: RequestHandler = catchAsync(async (req, res) => {
  const result = await GenericService.findAllResources<IVendor>(
    Vendor,
    req.query,
    ["email", "VendorName", "sub"]
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully retrieve Vendors",
    data: result,
  });
});

const updateVendor: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Vendor not authenticated", "");
  }
  const VendorId = req.user?._id;
  console.log("VendorId: ", VendorId.toString());

  if (!VendorId) {
    throw new AppError(httpStatus.BAD_REQUEST, "VendorId is required", "");
  }
  req.body.data.VendorId = VendorId;
  const result = await VendorServices.updateVendorService(req.body.data);

  emitMessage(VendorId, "update_vendor", {
    message: `vendorId:${result.vendor._id.toString()} updated successfully`,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully updated Vendor profile",
    data: result,
  });
});

const deleteVendor: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Vendor not authenticated", "");
  }
  const admin = req.user?._id;
  console.log("VendorId: ", admin.toString());

  if (!admin) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin ID is required", "");
  }
  req.body.data.admin = admin;
  const VendorId = await idConverter(req.body.data.VendorId);
  const result = await GenericService.deleteResources<IVendor>(
    Vendor,
    VendorId
  );

  emitMessage(VendorId.toString(), "update_vendor", {
    message: `A vendor deleted successfully`,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully deleted Vendor",
    data: result,
  });
});

const VendorController = {
  getVendor,
  getAllVendor,
  updateVendor,
  deleteVendor,
};

export default VendorController;
