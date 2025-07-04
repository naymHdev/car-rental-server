import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import { IBlog, TBlogUpdate } from "./blog.interface";
import Blog from "./blog.model";
import { idConverter } from "../../utility/idConverter";
import QueryBuilder from "../../app/builder/QueryBuilder";

const createNewBlogIntoDb = async (payload: IBlog) => {
  const { author } = payload;

  if (!author) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You must be logged in to post a blog"
    );
  }
  const newBlog = await Blog.create({ ...payload });

  if (!newBlog) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You must be logged in to post a blog"
    );
  }
  return { blog: newBlog };
};

const updateBlogIntoDb = async (
  payload: TBlogUpdate,
  blogId: string,
  files?: Express.Multer.File[]
) => {
  const { author, blogImage: bodyImageUrls, ...updateData } = payload;

  // Convert author
  const authorIdObject = await idConverter(author);
  if (!authorIdObject) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog id & vendor id is required");
  }

  // Find the blog
  const foundBlog = await Blog.findById(blogId);
  if (!foundBlog) {
    throw new AppError(httpStatus.NOT_FOUND, "No blog has found");
  }

  // 1. Parse image URLs sent in body
  let bodyImages: string[] = [];

  if (typeof bodyImageUrls === "string") {
    try {
      bodyImages = JSON.parse(bodyImageUrls); // case: stringified JSON
    } catch {
      bodyImages = [];
    }
  } else if (Array.isArray(bodyImageUrls)) {
    bodyImages = bodyImageUrls;
  }

  // 2. Get image URLs from uploaded files
  const uploadedImageUrls: string[] = (files || [])
    .map((file) => file.location || file.path || "") // Use your file URL logic (e.g. S3 location)
    .filter(Boolean);

  // 3. Merge: body URLs + uploaded file URLs
  const finalImages: string[] = [...bodyImages, ...uploadedImageUrls].filter(
    (img, index, arr) => arr.indexOf(img) === index // Remove duplicates
  );

  // 4. Save the merged images to blogImage
  updateData.blogImage = finalImages;

  // 5. Apply updates and save
  Object.assign(foundBlog, updateData);
  await foundBlog.save();

  return { blog: foundBlog };
};

const deleteBlogImage = async (id: string, image: string) => {
  const product = await Blog.findById(id);
  if (!product) throw new AppError(404, "Product not found");
  if (!product.blogImage.includes(image))
    throw new AppError(404, "Image not found");
  const newProd = await Blog.findByIdAndUpdate(
    id,
    { $pull: { images: image } },
    { new: true }
  );
  if (newProd) {
    const objectKey = image.split(".com/")[1];
    await deleteMultipleImagesFromS3([objectKey]);
  }
  return newProd;
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

  const result = await Blog.findById(blogId).populate({ path: "author" });

  return result;
};

const getAllBlogs = async (query: Record<string, unknown>) => {
  const { ...bQuery } = query;

  const baseQuery = Blog.find().populate("author");
  const blogsQuery = new QueryBuilder(baseQuery, bQuery)
    .search(["companyName", "blogName"])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await blogsQuery.modelQuery;
  const meta = await blogsQuery.countTotal();

  return { meta, blogs: result };
};

const getMyBlogs = async (query: Record<string, unknown>, myId: string) => {
  const { ...bQuery } = query;

  const baseQuery = Blog.find({ author: myId }).populate("author");
  const blogsQuery = new QueryBuilder(baseQuery, bQuery)
    .search(["companyName", "blogName"])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await blogsQuery.modelQuery;
  const meta = await blogsQuery.countTotal();

  return { meta, blogs: result };
};

const BlogServices = {
  createNewBlogIntoDb,
  updateBlogIntoDb,
  deleteBlogIntoDb,
  deleteAllBlogIntoDb,
  findSingleBlog,
  getAllBlogs,
  getMyBlogs,
  deleteBlogImage,
};

export default BlogServices;
