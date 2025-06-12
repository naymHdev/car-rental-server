import AppError from "../../app/error/AppError";
import { ICar, TCarUpdate } from "../car/car.interface";
import httpStatus from 'http-status'
import Car from "./car.model";
import { idConverter } from "../../utility/idConverter";
import QueryBuilder from "../../app/builder/QueryBuilder";

const addNewCarIntoDbService = async (payload: ICar) => {
    const { vendor } = payload
    if (!vendor) {
        throw new AppError(httpStatus.NOT_FOUND, "Vendor id is required")
    }
    const newCar = await Car.create(payload)
    if (!newCar) {
        throw new AppError(httpStatus.NOT_FOUND, "New car add failed")
    }
    return { car: newCar }
}

const findCarIntoDbService = async (carId: string) => {
    const carIdObject = await idConverter(carId)
    if (!carIdObject) {
        throw new AppError(httpStatus.NOT_FOUND, "Vendor id is required")
    }
    const foundCar = await Car.findById(carIdObject)
    if (!foundCar) {
        throw new AppError(httpStatus.NOT_FOUND, "No car has found")
    }
    return { car: foundCar }
}

const findAllCarIntoDbService = async (query: Record<string, unknown>) => {
    const baseQuery = Car.find().populate('vendor')
    const allCarQuery = new QueryBuilder(baseQuery, query)
        .search(['model', 'fuelType'])
        .filter()
        .sort()
        .pagination()
        .fields()

    const cars = await allCarQuery.modelQuery
    const meta = await allCarQuery.countTotal()

    return { meta: meta, car: cars }
}

const updateCarIntoDbService = async (payload: TCarUpdate) => {
    const { carId, vendor, ...updateData } = payload
    const carIdObject = await idConverter(carId)
    const vendorIdObject = await idConverter(vendor)

    if (!carIdObject || !vendorIdObject) {
        throw new AppError(httpStatus.NOT_FOUND, "Car id & vendor id is required")
    }
    const foundCar = await Car.findById(carIdObject)
    if (!foundCar) {
        throw new AppError(httpStatus.NOT_FOUND, "No car has found")
    }
    if (vendor !== foundCar.vendor.toString()) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE, "Vendor does not match the car's vendor")

    }
    Object.assign(foundCar, updateData)
    foundCar.save()
    return { car: foundCar }
}

const deleteCarIntoDbService = async (carId: string, vendor: string) => {
    const carIdObject = await idConverter(carId)
    const vendorIdObject = await idConverter(carId)

    if (!carIdObject || !vendorIdObject) {
        throw new AppError(httpStatus.NOT_FOUND, "Car id & vendor id is required")
    }
    const foundCar = await Car.findById(carIdObject)
    if (!foundCar) {
        throw new AppError(httpStatus.NOT_FOUND, "No car has found")
    }
    if (vendor !== foundCar.vendor.toString()) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE, "Vendor does not match the car's vendor")
    }
    const deleteCar = await Car.deleteOne({ _id: carIdObject })
    if (!deleteCar.deletedCount) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Car deletion failed");
    }
    return { message: `Car with ID ${carId} deleted successfully` }
}

const CarService = {
    addNewCarIntoDbService,
    findCarIntoDbService,
    findAllCarIntoDbService,
    updateCarIntoDbService,
    deleteCarIntoDbService
}

export default CarService