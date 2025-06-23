import { model, Model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";
import MongooseHelper from "../../utility/mongoose.helpers";

const BlogSchema: Schema = new Schema<IBlog>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    blogName: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
      required: true,
    },
    category: [
      {
        type: String,
        required: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MongooseHelper.findExistence(BlogSchema);
MongooseHelper.applyToJSONTransform(BlogSchema);

BlogSchema.index({ blogName: "text", details: "text" });

const Blog: Model<IBlog> = model<IBlog>("Blog", BlogSchema);

export default Blog;
