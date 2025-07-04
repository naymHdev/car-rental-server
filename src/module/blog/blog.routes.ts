import express from "express";
import BlogController from "./blog.controller";
import { upload } from "../../middleware/multer/multer";
import { fileHandle } from "../../middleware/fileHandle";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create_blog",
  auth("Vendor"),
  upload.fields([{ name: "blogImage", maxCount: 10 }]),
  fileHandle("blogImage"),
  BlogController.createNewBlog
);

router.get("/get_all_blog", BlogController.getAllBlog);
router.get("/get-blog-details/:id", BlogController.findSingleBlog);

router.get("/my-blogs", auth("Vendor"), BlogController.getMyBlogs);

router.patch(
  "/update_blog/:id",
  auth("Vendor"),
  upload.fields([{ name: "blogImage", maxCount: 10 }]),
  fileHandle("blogImage"),
  BlogController.updateBlog
);
router.delete(
  "/blogImage/:id",
  auth("Vendor"),
  BlogController.deleteBlogImages
);

router.delete("/delete_blog/:id", BlogController.deleteBlog);

const BlogRouter = router;
export default BlogRouter;
