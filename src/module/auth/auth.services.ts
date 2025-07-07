import fs from "fs";
import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import config from "../../app/config";
import { idConverter } from "../../utility/idConverter";
import { jwtHelpers } from "../../app/jwtHelpers/jwtHelpers";
import { Model } from "mongoose";
import { ISignIn, ISignup } from "./auth.interface";
import { getRoleModels } from "../../utility/role.utils";
import { IUser } from "../user/user.interface";
import { IVendor } from "../vendor/vendor.interface";
import { IAdmin } from "../admin/admin.interface";
import User from "../user/user.model";
import { otpServices } from "../otp/otp.service";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { generateOtp } from "../../utility/generateOtp";
import moment from "moment";
import path from "path";
import { sendEmail } from "../../utility/mailSender";
import bcrypt from "bcrypt";

const signUpService = async (payload: ISignup) => {
  const { email, role } = payload;
  const QueryModel = getRoleModels(role);

  if (!QueryModel) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid role provided", "");
  }

  const existing = await QueryModel?.findOne({ email });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Email already registered. Please, signin...",
      ""
    );
  }

  const newUser = await QueryModel?.create(payload);

  let otpToken;
  if (newUser?.verification?.status == false) {
    otpToken = await otpServices.resendOtp(newUser?.email);
  }

  const signUp = await QueryModel?.findById(newUser?._id).select("-password");
  return { signUp: signUp, otpToken: otpToken };
};

const loginService = async (payload: ISignIn) => {
  // console.log(payload);
  const QueryModel: Model<IUser | IVendor | IAdmin> = User;
  const query: Record<string, unknown> = { email: payload.email };
  if (payload.sub) {
    query["sub"] = payload.sub;
    query["authProviderName"] = payload.authProviderName;
  }

  const isExist = await QueryModel.findOne(query, {
    _id: 1,
    password: 1,
    email: 1,
    role: 1,
    companyName: 1,
  });

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

  if (user?.verification?.status == false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not verified! Please verify your email address. Check your inbox."
    );
  }

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
  // console.log("isUserExist: ", isExist);
  return {
    accessToken,
    refreshToken,
    user: user,
  };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "You are not registered!");
  }

  const jwtPayload = {
    email: email,
    userId: user?._id,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: "3m",
  });
  // console.log('token: ', token);

  const currentTime = new Date();
  const otp = generateOtp();
  const expiresAt = moment(currentTime).add(5, "minute");

  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
    },
  });

  const otpEmailPath = path.resolve(
    process.cwd(),
    "src",
    "app",
    "public",
    "view",
    "forgot_pass_mail.html"
  );
  // console.log('otpEmailPath: ', otpEmailPath);

  await sendEmail(
    user?.email,
    "Your reset password OTP is",
    fs
      .readFileSync(otpEmailPath, "utf8")
      .replace("{{otp}}", otp)
      .replace("{{email}}", user?.email)
  );

  return { email, token };
};

// const resetPassword = async (
//   token: string,
//   payload: { newPassword: string; confirmPassword: string },
// ) => {
//   let decode;
//   try {
//     decode = jwt.verify(
//       token,
//       config.jwt_access_secret as string,
//     ) as JwtPayload;
//   } catch (err: any) {
//     throw new AppError(
//       httpStatus.UNAUTHORIZED,
//       'Session has expired. Please try again',
//     );
//   }

//   const user: IUser | null = await User.findById(decode?.userId).select(
//     'verification',
//   );

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   if (
//     !user?.verification?.expiresAt ||
//     new Date() > new Date(user.verification.expiresAt)
//   ) {
//     throw new AppError(httpStatus.FORBIDDEN, 'Session has expired');
//   }

//   if (!user?.verification?.status) {
//     throw new AppError(httpStatus.FORBIDDEN, 'OTP is not verified yet');
//   }

//   console.log('payload: pass ', payload.newPassword);

//   if (payload?.newPassword !== payload?.confirmPassword) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'New password and confirm password do not match',
//     );
//   }

//   const hashedPassword = await bcrypt.hash(
//     payload?.newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );

//   // console.log('hashedPassword: ', hashedPassword);

//   const result = await User.findByIdAndUpdate(decode?.userId, {
//     password: hashedPassword,
//     verification: {
//       otp: 0,
//       status: true,
//     },
//   });

//   return result;
// };

const resetPassword = async (
  token: string,
  payload: { newPassword: string; confirmPassword: string }
) => {

  // console.log('token: ', token);

  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
  } catch (err: any) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Session has expired. Please try again"
    );
  }

  // console.log("decode: ", decode);

  const user = await User.findById(decode?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    !user?.verification?.expiresAt ||
    new Date() > new Date(user.verification.expiresAt)
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Session has expired");
  }

  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, "OTP is not verified yet");
  }

  if (payload.newPassword !== payload.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and confirm password do not match"
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  user.password = hashedPassword;
  user.verification.otp = 0;
  user.verification.status = true;

  await user.save(); // ✅ Ensures full Mongoose validation and hooks

  return {
    _id: user._id,
    email: user.email,
  };
};

const AuthServices = {
  signUpService,
  loginService,
  forgotPassword,
  resetPassword,
};

export default AuthServices;
