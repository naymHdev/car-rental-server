import { Types } from "mongoose";


export interface IBlog {
  author: Types.ObjectId;
  blogName: string;
  details: string;
  blogImage: string[];
  category: string[];
  updatedAt: Date;
  createdAt: Date;
  isDeleted: boolean;
}

export interface IBlogUpdate extends IBlog {
  blogId: string;
}

export type TBlogInput = Omit<IBlog, "author"> & {
  author: string;
};
export type TBlogUpdate = Partial<IBlog> & { blogId: string; author: string };
