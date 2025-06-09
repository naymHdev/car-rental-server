import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import {
  IUpdateUserPassword,
  IVerifyForgotPassword,
} from "./auth.constant";
import config from "../../app/config";
import ForgotPassword from "./auth.model";
import { sendMail } from "../../app/mailer/sendMail";
import { emailRegex } from "../../constants/regex.constants";
import { idConverter } from "../../utility/idConverter";
import { jwtHelpers } from "../../app/jwtHelpers/jwtHelpers";
import { Model } from "mongoose";
import { ISignIn, ISignup } from "./auth.interface";
import { getRoleModels } from "../../utility/role.utils";
import { IUser } from "../user/user.interface";
import { IVendor } from "../vendor/vendor.interface";
import { IAdmin } from "../admin/admin.interface";
import User from "../user/user.model";
import { TRole } from "../../types/express";

// const signUpService = async (payload: ISignup) => {
//   console.log("signUpService:", payload);
//   const { email, role } = payload;
//   const QueryModel = getRoleModels(role);
//   const existing = await QueryModel?.findOne({ email });
//   if (existing) {
//     const existingSub =
//       existing.authProvider?.map((provider: IAuthProvider) => provider.sub) ||
//       [];
//     const isProviderExist = authProvider?.some((newProvider) =>
//       existingSub.includes(newProvider.sub)
//     );
//     if (isProviderExist) {
//       throw new AppError(
//         httpStatus.CONFLICT,
//         "Email already registered. Please, signin...",
//         ""
//       );
//     }
//     existing.authProvider?.push(...(authProvider || []));
//     await existing.save();
//     return existing;
//   }
//   const newUser = await QueryModel?.create({ payload });

//   return await QueryModel?.findById(newUser?._id).select("-password");
// };

const signUpService = async (payload: ISignup) => {

  console.log("signUpService:", payload);

  const { email, role } = payload;
  const QueryModel = getRoleModels(role);

  if (!QueryModel) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid role provided", '')
  }

  const existing = await QueryModel?.findOne({ email });
  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Email already registered. Please, signin...",
      ""
    );
  }

  // if (existing && existing?.sub && (existing?.sub === sub)) {
  //   throw new AppError(
  //     httpStatus.CONFLICT,
  //     "Email already registered. Please, signin...",
  //     ""
  //   );
  // }

  // let newUser;
  // if (payload.sub && payload.authProviderName) {
  //   newUser = await QueryModel?.create({ sub, email, role, authProviderName })
  // }

  const newUser = await QueryModel?.create(payload);

  return await QueryModel?.findById(newUser?._id).select("-password");
};

const loginService = async (payload: ISignIn) => {
  console.log(payload);
  const QueryModel: Model<IUser | IVendor | IAdmin> = User;
  const query: Record<string, unknown> = { email: payload.email };
  if (payload.sub) {
    query["sub"] = payload.sub;
    query["authProviderName"] = payload.authProviderName;

  }

  const isExist = await QueryModel.findOne(
    query,
    { _id: 1, password: 1, email: 1, role: 1, companyName: 1 }
  );

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
  }

  if (payload.password) {
    const isPasswordValid = await isExist.comparePassword(payload.password);

    if (!isPasswordValid) {
      throw new AppError(httpStatus.FORBIDDEN, "This Password Not Matched", "");
    }
  }

  const user = await QueryModel.findById(await idConverter(isExist._id)).lean();

  const jwtPayload = {
    id: isExist._id.toString(),
    role: isExist.role,
    email: isExist.email,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.refresh_expires_in as string
  );
  console.log("isUserExist: ", isExist);
  return {
    accessToken,
    refreshToken,
    user: user,
  };
};

const requestForgotPasswordService = async (email: string, role: TRole) => {
  console.log("email: ", email);

  if (!emailRegex.test(email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email format", "");
  }

  const QueryModel = getRoleModels(role);

  const user = await QueryModel.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Email not registered before", "");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await ForgotPassword.deleteMany({ email });

  const subject = "forgot password";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Use the following OTP to reset your password:</p>
      <h3 style="background: #f0f0f0; padding: 10px; display: inline-block;">${otp}</h3>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  try {
    await sendMail(email, subject, html);

    const result = await ForgotPassword.create({
      email,
      otp,
      expiresAt,
    });

    return {
      email: result.email,
      expiresAt: result.expiresAt,
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to process password reset request",
      error as string
    );
  }
};

const verifyForgotPasswordService = async (
  payload: IVerifyForgotPassword
) => {
  const resetRecord = await ForgotPassword.findOne({
    email: payload.email,
    otp: payload.otp,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP", "");
  }
  const QueryModel = getRoleModels(payload.role!)
  if (!QueryModel) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid role provided", '')
  }

  const user = await QueryModel?.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
  }

  const updatedUser = await QueryModel.findOneAndUpdate(
    { email: payload.email },
    { password: payload.newPassword },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to reset password", "");
  }

  await ForgotPassword.deleteOne({ _id: resetRecord._id });

  return updatedUser;
};

const updateUserPasswordService = async (
  payload: IUpdateUserPassword
) => {
  const { userId, password, newPassword, role } = payload;
  console.log(userId);

  const userIdObject = await idConverter(userId!);
  const QueryModel = getRoleModels(role)
  const user = await QueryModel.findOne(
    { _id: userIdObject, isDeleted: { $ne: true } },
    { password: 1, email: 1 }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Current password is incorrect",
      ""
    );
  }

  const updatedUser = await QueryModel.findOneAndUpdate(
    { _id: userIdObject, isDeleted: { $ne: true } },
    { password: newPassword },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to update password", "");
  }

  return updatedUser;
};

const AuthServices = {
  signUpService,
  loginService,
  requestForgotPasswordService,
  verifyForgotPasswordService,
  updateUserPasswordService,
};

export default AuthServices;
