import express from "express";
import BlogController from "./blog.controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/multer/multer";
import { fileHandle } from "../../middleware/fileHandle";

const router = express.Router();

// router.get('/getBlog', BlogController.getAllBlog);

// router.get('/getAllBlog', BlogController.getAllBlog);

router.post(
  "/create_blog",
  auth("Vendor"),
  upload.fields([{ name: "blogImage", maxCount: 1 }]),
  fileHandle("blogImage"),
  // validationRequest(BlogValidationSchema.createBlogValidation),
  BlogController.createNewBlog
);

router.get(
  "/get_blog",
  // validationRequest(AuthValidationSchema.playerSignUpValidation),
  BlogController.getBlog
);

router.get(
  "/get_all_blog",
  BlogController.getAllBlog
);

router.patch(
  "/update_blog",
  // auth('Vendor'),
  // uploadBlog.fields([{ name: 'blogImage', maxCount: 1 }]),
  // validationRequest(BlogValidationSchema.updateBlogValidation),
  BlogController.updateBlog
);

router.delete(
  "/delete_blog",
  // auth('Vendor'),
  // validationRequest(BlogValidationSchema.deleteBlogValidation),
  BlogController.deleteBlog
);

router.delete("/delete-all-blog", BlogController.deleteAllBlog);

const BlogRouter = router;
export default BlogRouter;
