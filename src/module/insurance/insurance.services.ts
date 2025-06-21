import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { idConverter } from "../../utility/idConverter";
import { TInsurance, TInsuranceUpdate } from "./insurance.interface";
import Insurance from "./insurance.model";

const createInsuranceService = async (payload: TInsurance) => {
  const newInsurance = await Insurance.create(payload);
  if (!newInsurance) {
    throw new AppError(httpStatus.NOT_IMPLEMENTED, "Insurance not inserted");
  }
  return { insurance: newInsurance };
};

const updateInsuranceService = async (payload: TInsuranceUpdate) => {
  const { insuranceId, ...updateData } = payload;
  const insuranceIdObject = await idConverter(insuranceId);

  if (!insuranceIdObject) {
    throw new AppError(httpStatus.NOT_FOUND, "Insurance id is required");
  }
  const foundInsurance = await Insurance.findById(insuranceIdObject);
  if (!foundInsurance) {
    throw new AppError(httpStatus.NOT_FOUND, "No insurance has found");
  }

  Object.assign(foundInsurance, updateData);
  foundInsurance.save();
  return { insurance: foundInsurance };
};

const InsuranceServices = {
  createInsuranceService,
  updateInsuranceService,
};

export default InsuranceServices;
