import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { idConverter } from "../../utility/idConverter";
import { TVendorUpdate } from "./vendor.interface";
import Vendor from "./vendor.model";
import Order from "../order/order.model";
import Car from "../car/car.model";
import QueryBuilder from "../../app/builder/QueryBuilder";

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

const findMyRents = async (myId: string, query: Record<string, unknown>) => {
  const { ...oQuery } = query;

  // Step 1: Find all cars that belong to this vendor
  const myCars = await Car.find({ vendor: myId }).select("_id");

  const carIds = myCars.map((car) => car._id);

  // Step 2: Find all orders where carId is in that list
  const baseQuery = Order.find({ carId: { $in: carIds } }).populate("carId").populate("userId");

  const allOrderQuery = new QueryBuilder(baseQuery, oQuery)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await allOrderQuery.modelQuery;
  const meta = await allOrderQuery.countTotal();

  return { meta, orders: result };
};

const VendorServices = {
  updateVendorService,
  findMyRents,
};

export default VendorServices;
