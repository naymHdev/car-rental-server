import { RequestHandler } from 'express';
import AppError from '../app/error/AppError';
import httpStatus from 'http-status';

const s3Bucket: RequestHandler =async (req, res, next) => {
  if (!req.files) {
    throw new AppError(httpStatus.NOT_FOUND, 'No file provided', '');
  }
};
