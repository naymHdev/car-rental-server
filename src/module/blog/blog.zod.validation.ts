import { z } from "zod";

const createBlogValidation = z.object({
  author: z.string({ required_error: "Author must be valid string" }),
  blogName: z.string({ required_error: "Title must be valid string" }),
  details: z.string({ required_error: "Description must be valid string" }),
  category: z.array(z.string()),
  isDeleted: z.boolean().default(false),
});

const BlogValidationSchema = {
  createBlogValidation,
};

export default BlogValidationSchema;
