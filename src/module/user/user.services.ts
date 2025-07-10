import httpStatus from "http-status";
import { TUserUpdate } from "./user.interface";
import AppError from "../../app/error/AppError";
import User from "./user.model";
import { idConverter } from "../../utility/idConverter";
import { IJwtPayload } from "../auth/auth.interface";
import config from "../../app/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const myProfile = async (authUser: IJwtPayload) => {
  const isUserExists = await User.findById(authUser._id).populate("_id");
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  return {
    ...isUserExists.toObject(),
  };
};
const updateUserService = async (payload: TUserUpdate) => {
  // console.log("payload: ", payload);

  const { userId, ...updateData } = payload;
  const userIdObject = await idConverter(userId);

  if (!userIdObject) {
    throw new AppError(httpStatus.NOT_FOUND, "User id & vendor id is required");
  }
  const foundUser = await User.findById(userIdObject);
  if (!foundUser) {
    throw new AppError(httpStatus.NOT_FOUND, "No user has found");
  }

  // console.log("userId: ", userId.toString());
  // console.log("foundUser._id.toString(): ", foundUser._id.toString());

  if (userId.toString() !== foundUser._id.toString()) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Vendor does not match the car's vendor"
    );
  }
  Object.assign(foundUser, updateData);
  foundUser.save();
  return { user: foundUser };
};

// currentPassword: string, newPassword: string
const changeUserPassword = async (
  token: string,
  payload: {
    currentPassword: string;
    newPassword: string;
  }
) => {
  // Decode user from token
  const decoded = jwt.verify(token, config.jwt_access_secret as string) as {
    id: string;
  };

  // Fetch user with password
  const user = await User.findById(decoded.id).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check current password
  const isMatch = await bcrypt.compare(
    payload.currentPassword,
    user.password as string
  );
  if (!isMatch) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect"
    );
  }

  // Set and save new password (this triggers pre-save hashing)
  user.password = payload.newPassword;
  await user.save();

  return {
    success: true,
    message: "Password updated and hashed successfully",
  };
};

const UserServices = {
  updateUserService,
  myProfile,
  changeUserPassword,
};

export default UserServices;
