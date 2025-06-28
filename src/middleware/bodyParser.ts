import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utility/catchAsync";
import AppError from "../app/error/AppError";

export const parseBody = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.data) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please provide data in the body under data key"
      );
    }
    req.body = JSON.parse(req.body.data);

    next();
  }
);
