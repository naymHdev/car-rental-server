import httpStatus from "http-status";
import { TUserUpdate } from "./user.interface";
import AppError from "../../app/error/AppError";
import User from "./user.model";
import { idConverter } from "../../utility/idConverter";
import { IJwtPayload } from "../auth/auth.interface";

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


//  ---------------------------------------------- Get In Touch ----------------------------------------------

const UserServices = {
  updateUserService,
  myProfile,
};

export default UserServices;
