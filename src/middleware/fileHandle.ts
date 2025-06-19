import { fileUploadToS3 } from "../utility/uploadFile";
import catchAsync from "../utility/catchAsync";
import { RequestHandler } from "express";

export const fileHandle = (fieldName: string): RequestHandler =>
  catchAsync(async (req, res, next) => {
    const files = (req.files as Record<string, Express.Multer.File[]>)[
      fieldName
    ];
    if (!files || files.length === 0) {
      req.body.data[`${fieldName}Urls`] = [];
      return next();
    }
    const fileList = [];
    for (const file of files) {
      const url = await fileUploadToS3(
        file.buffer,
        file.originalname,
        fieldName
      );
      fileList.push(url);
    }
    req.body.data[`${fieldName}`] = fileList;
    next();
  });
