// import { model, Model, Schema } from "mongoose";
// import { IBlog } from "./blog.interface";
// import MongooseHelper from "../../utility/mongoose.helpers";

// const BlogSchema: Schema = new Schema<IBlog>(
//   {
//     author: {
//       type: Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     blogImage: {
//       type: String,
//       required: true,
//     },
//     category: [
//       {
//         type: String,
//         required: true,
//       },
//     ],
//     // rewards: {
//     //   type: [
//     //     {
//     //       code: { type: String, required: true },
//     //       reward: { type: String, required: true },
//     //       validity: { type: String, required: true },
//     //     },
//     //   ],
//     //   required: true,
//     //   default: [],
//     // },
//     draft: {
//       type: Boolean,
//       required: true,
//     },
//     published: {
//       type: Boolean,
//       required: true,
//     },
//     updatedAt: {
//       type: Date,
//       default: new Date(),
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// MongooseHelper.findExistence(BlogSchema);
// MongooseHelper.applyToJSONTransform(BlogSchema);

// BlogSchema.index({ title: "text", description: "text" });
// BlogSchema.index({ title: "text", description: "text" });

// const Blog: Model<IBlog> = model<IBlog>("Blog", BlogSchema);

// export default Blog;
