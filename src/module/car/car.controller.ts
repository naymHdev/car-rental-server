import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import httpStatus from 'http-status'
import CarService from "./car.services";
import sendResponse from "../../utility/sendResponse";
import GenericService from "../../utility/genericService.helpers";
import { idConverter } from "../../utility/idConverter";
import { ICar } from "./car.interface";
import Car from "./car.model";

const addNewCar: RequestHandler = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated', '');
    }
    const vendor = req.user?._id
    console.log('userId: ', vendor.toString());

    if (!vendor) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Vendor ID is required', '');
    }
    req.body.data.vendor = vendor
    const result = await CarService.addNewCarIntoDbService(
        req.body.data,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'successfully added new car',
        data: result,
    }
    )
}
)

const findCar: RequestHandler = catchAsync(async (req, res) => {
    const { carId } = req.body.data
    console.log('userId: ', carId.toString());

    if (!carId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Car ID is required', '');
    }
    const result = await CarService.findCarIntoDbService(carId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'successfully found car',
        data: result,
    }
    )
}
)

const findAllCar: RequestHandler = catchAsync(async (req, res) => {
    const result = await GenericService.findAllResources<ICar>(Car, req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'successfully added new car',
        data: result,
    }
    )
}
)

const updateCar: RequestHandler = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated', '');
    }
    const vendor = req.user?._id
    console.log('userId: ', vendor.toString());

    if (!vendor) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Vendor ID is required', '');
    }
    req.body.data.vendor = vendor
    const result = await CarService.updateCarIntoDbService(
        req.body.data,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'successfully added new car',
        data: result,
    }
    )
}
)

const deleteCar: RequestHandler = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated', '');
    }
    const vendor = req.user?._id
    console.log('userId: ', vendor.toString());

    if (!vendor) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Vendor ID is required', '');
    }
    req.body.data.vendor = vendor
    const carId = await idConverter(req.body.data.carId)
    const result = await GenericService.deleteResources<ICar>(Car, carId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'successfully added new car',
        data: result,
    }
    )
}
)

const CarController = {
    addNewCar,
    findCar,
    findAllCar,
    updateCar,
    deleteCar
}

export default CarController