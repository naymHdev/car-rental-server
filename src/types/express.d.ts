import { Request, Response, NextFunction } from "express";
import { File } from "multer";
import { JwtPayload } from "jsonwebtoken";
import { IPlayer } from "../module/user/user.interface";
import { LeanDocument } from "mongoose";

export const Role = ["User", "Vendor", "Admin"] ;
export type TRole = (typeof Role)[number];

export interface UserPayload extends JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export interface AdminPayload extends JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export type AuthPayload = UserPayload;

export interface RequestWithFiles extends Request {
  user?: LeanDocument<IPlayer>;
  files?: { [fieldname: string]: File[] } | File[] | undefined;
}

export type RequestHandlerWithFiles = (
  req: RequestWithFiles,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

declare global {
  namespace Express {
    interface Request {
      user?: LeanDocument<IPlayer>;
    }
  }
}
