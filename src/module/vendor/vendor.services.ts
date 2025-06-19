import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { idConverter } from "../../utility/idConverter";
import { TVendorUpdate } from "./vendor.interface";
import Vendor from "./vendor.model";

const updateVendorService = async (payload: TVendorUpdate) => {
  const { vendorId, ...updateData } = payload;
  const vendorIdObject = await idConverter(vendorId);

  if (!vendorIdObject) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor id is required");
  }
  const foundVendor = await Vendor.findById(vendorIdObject);
  if (!foundVendor) {
    throw new AppError(httpStatus.NOT_FOUND, "No Vendor has found");
  }

  Object.assign(foundVendor, updateData);
  foundVendor.save();
  return { vendor: foundVendor };
};

const VendorServices = {
  updateVendorService,
};

export default VendorServices;
