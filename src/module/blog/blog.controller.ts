import { RequestHandlerWithFiles } from "../../types/express";
import catchAsync from "../../utility/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utility/sendResponse";
import { RequestHandler } from "express";
import BlogServices from "./blog.service";
import AppError from "../../app/error/AppError";
import NotificationServices from "../notification/notification.service";

const createNewBlog: RequestHandlerWithFiles = catchAsync(async (req, res) => {
  req.body.data.author = req.user._id;

  const result = await BlogServices.createNewBlogIntoDb(req.body.data);

  await NotificationServices.sendNoification({
    ownerId: req.user?._id,
    key: "notification",
    data: {
      id: result.blog?._id.toString(),
      message: `New blog added`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully created blog",
    data: result,
  });
});

const getAllBlog: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlogs(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully retrieved all blogs",
    data: result,
  });
});

const updateBlog: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated", "");
  }
  const vendor = req.user?._id;

  if (!vendor) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor ID is required", "");
  }
  req.body.data.author = vendor;
  const result = await BlogServices.updateBlogIntoDb(req.body.data, id);

  await NotificationServices.sendNoification({
    ownerId: req.user?._id,
    key: "notification",
    data: {
      id: result.blog?._id.toString(),
      message: `A blog updated`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully updated blog",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await BlogServices.deleteBlogIntoDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "successfully deleted blog",
    data: result,
  });
});

const findSingleBlog: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.findSingleBlog(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully retrieve blog data",
    data: result,
  });
});

const getMyBlogs = catchAsync(async (req, res) => {
  const myId = req.user?._id;
  // console.log("myId___", myId);

  const result = await BlogServices.getMyBlogs(req.query, myId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully retrieve blog data",
    data: result,
  });
});

const BlogController = {
  createNewBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  findSingleBlog,
  getMyBlogs,
};

export default BlogController;
