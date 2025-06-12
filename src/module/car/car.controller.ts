import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import AppError from "../../app/error/AppError";
import httpStatus from 'http-status'
import CarService from "./car.services";
import sendResponse from "../../utility/sendResponse";

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

const CarController = {
    addNewCar,
}

export default CarController