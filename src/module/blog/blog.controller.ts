import { RequestHandlerWithFiles } from '../../types/express';
import catchAsync from '../../utility/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utility/sendResponse';
import { RequestHandler } from 'express';
import BlogServices from './blog.services';
import AppError from '../../app/error/AppError';
import GenericService from '../../utility/genericService.helpers';
import { IBlog } from './blog.interface';
import Blog from './blog.model';
import { idConverter } from '../../utility/idConverter';

const createNewBlog: RequestHandlerWithFiles = catchAsync(async (req, res) => {
  console.log('GameController.createNewGame - Inputs:', {
    body: req.body,
    files: req.files,
    user: req.user,
    headers: req.headers,
  });

  const result = await BlogServices.createNewBlogIntoDb(req.body.data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully created blog',
    data: result,
  });
});

const getBlog: RequestHandler = catchAsync(async (req, res) => {
  const { authorId } = req.body.data
  if (!authorId) {
    throw new AppError(httpStatus.NOT_FOUND, `Author:${authorId} not found`)
  }
  const result = await GenericService.findResources<IBlog>(Blog, await idConverter(authorId));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved all blogs',
    data: result,
  });
});

const getAllBlog: RequestHandler = catchAsync(async (req, res) => {
  const result = await GenericService.findAllResources<IBlog>(Blog, req.query, ['author', 'blogName']);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved all blogs',
    data: result,
  });
});

const updateBlog: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated', '');
  }
  const vendor = req.user?._id
  console.log('userId: ', vendor.toString());

  if (!vendor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Vendor ID is required', '');
  }
  req.body.data.author = vendor
  const result = await BlogServices.updateBlogIntoDb(
    req.body.data,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully updated blog',
    data: result,
  }
  )
}
)

const deleteBlog: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated', '');
  }
  const vendor = req.user?._id
  console.log('userId: ', vendor.toString());
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Author ID is required', '');
  }
  const { blogId } = req.body.data
  if (!blogId) {
    throw new AppError(httpStatus.NOT_FOUND, 'blogId is required', '');
  }

  req.body.data.author = vendor
  const result = await GenericService.deleteResources<IBlog, 'author'>(Blog, blogId, await idConverter(vendor), 'author')
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'successfully deleted new car',
    data: result,
  }
  )
}
)

// const updateBlog: RequestHandlerWithFiles = catchAsync(async (req, res) => {
//   console.log('BlogController.createNewGame - Inputs:', {
//     body: req.body.data,
//     file: req.files,
//     headers: req.headers,
//   });

//   const files = req.files as
//     | { [fieldname: string]: Express.Multer.File[] }
//     | undefined;

//   const blogImageFile = files?.blogImage ? files.blogImage[0] : undefined;
//   const result = await BlogServices.updateBlogIntoDb(
//     req.body.data,
//     blogImageFile,
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Blog updated perfectly',
//     data: result,
//   });
// });

// const deleteBlog: RequestHandler = catchAsync(async (req, res) => {
//   console.log('BlogController.createNewGame - Inputs:', {
//     body: req.body.data,
//     headers: req.headers,
//   });
//   if (req.user.role !== 'SUPERADMIN') {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'Only Super Admin can delet blog',
//       '',
//     );
//   }
//   const result = await BlogServices.deleteBlogIntoDb(req.body.data.blogId!);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Blog deleted perfectly',
//     data: result,
//   });
// });

const deleteAllBlog: RequestHandler = catchAsync(async (req, res) => {
  console.log('BlogController.createNewGame - Inputs:', {
    body: req.body.data,
    headers: req.headers,
  });

  const result = await BlogServices.deleteAllBlogIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All blogs deleted perfectly',
    data: result,
  });
});

const BlogController = {
  createNewBlog,
  getBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  deleteAllBlog,
};

export default BlogController;
