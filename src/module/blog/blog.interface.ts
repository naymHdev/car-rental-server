import { Types } from "mongoose";
export interface IBlog {
    author: Types.ObjectId;
    blogName: string;
    details: string;
    blogImage: string;
    category: string[];
    updatedAt: Date;
    isDeleted: boolean;
}

export interface IBlogUpdate extends IBlog {
    blogId: string;
}
