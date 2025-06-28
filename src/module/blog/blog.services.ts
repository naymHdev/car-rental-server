import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { IBlog, TBlogUpdate } from "./blog.interface";
import Blog from "./blog.model";
import { idConverter } from "../../utility/idConverter";

const createNewBlogIntoDb = async (payload: IBlog) => {
  const { author } = payload;

  if (!author) {
    throw new AppError(httpStatus.NOT_FOUND, "Author id is required");
  }
  const newBlog = await Blog.create({ ...payload });

  if (!newBlog) {
    throw new AppError(httpStatus.NOT_FOUND, "New blog add failed");
  }
  return { blog: newBlog };
};

const updateBlogIntoDb = async (payload: TBlogUpdate, blogId: string) => {
  const { author, ...updateData } = payload;

  const authorIdObject = await idConverter(author);

  if (!authorIdObject) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog id & vendor id is required");
  }
  const foundBlog = await Blog.findById(blogId);
  if (!foundBlog) {
    throw new AppError(httpStatus.NOT_FOUND, "No blog has found");
  }
  // if (author !== foundBlog.author.toString()) {
  //   throw new AppError(httpStatus.NOT_ACCEPTABLE, "Author does not this blog");
  // }

  Object.assign(foundBlog, updateData);
  foundBlog.save();
  return { blog: foundBlog };
};

const deleteBlogIntoDb = async (blogId: string) => {
  if (!blogId) {
    throw new AppError(httpStatus.NOT_FOUND, "BlogId is required", "");
  }
  const blogIdObject = await idConverter(blogId);
  const isExist = await Blog.findById(blogIdObject);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not exist in database", "");
  }
  const deleteBlog = await Blog.deleteOne({
    _id: blogIdObject,
    isDeleted: { $ne: true },
  });
  if (deleteBlog.deletedCount === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Blog not deleted yet from database",
      ""
    );
  }
  return { success: true, message: "Blog deleted successfully" };
};

const deleteAllBlogIntoDb = async () => {
  const blogs = await Blog.find();
  if (!blogs || blogs.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No blog exist in database", "");
  }
  const deleteBlog = await Blog.deleteMany({ isDeleted: { $ne: true } });
  if (deleteBlog.deletedCount === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Blog not deleted yet from database",
      ""
    );
  }
  return { success: true, message: "All blog deleted successfully" };
};

const findSingleBlog = async (blogId: string) => {
  if (!blogId) {
    throw new AppError(httpStatus.NOT_FOUND, "BlogId is required", "");
  }
  const blogIdObject = await idConverter(blogId);
  const isExist = await Blog.findById(blogIdObject);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not exist in database", "");
  }
  return { blog: isExist };
};

const BlogServices = {
  createNewBlogIntoDb,
  updateBlogIntoDb,
  deleteBlogIntoDb,
  deleteAllBlogIntoDb,
  findSingleBlog,
};

export default BlogServices;
