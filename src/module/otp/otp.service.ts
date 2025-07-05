import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import moment from "moment";
import path from "path";
import fs from "fs";
import AppError from "../../app/error/AppError";
import config from "../../app/config";
import { generateOtp } from "../../utility/generateOtp";
import { sendEmail } from "../../utility/mailSender";
import User from "../user/user.model";

const verifyOtp = async (token: string, otp: string | number) => {
  console.log("token", token);
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  let decode;

  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as Secret
    ) as JwtPayload;
  } catch (err: any) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Session has expired. Please try to submit OTP within 3 minute"
    );
  }

  const user = await User.findById(decode?.userId).select(
    "verification status "
  );

  // console.log("user otp", user);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (
    !user?.verification?.expiresAt ||
    new Date() > new Date(user.verification.expiresAt)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "OTP has expired. Please resend it"
    );
  }

  if (user?.verification?.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already verified, need to login"
    );
  }

  if (Number(otp) !== Number(user?.verification?.otp)) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP did not match");
  }

  const updateUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        verification: {
          otp: 0,
          expiresAt: moment().add(3, "minute"),
          status: true,
        },
        isverified: true,
      },
    },
    { new: true }
  ).select("email _id name role");

  const jwtPayload = {
    email: updateUser?.email,
    role: updateUser?.role,
    userId: updateUser?._id,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: "7d", //7 days
  });

  return { user: updateUser, accessToken: accessToken };
};

const resendOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (user?.verification?.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already verified, need to login"
    );
  }

  const otp = generateOtp();
  // console.log("new otp", otp);

  // const expiresAt = moment().add(5, "minute");
  const expiresAt = moment().add(5, "minutes").toDate();
  console.log("expiresAt", expiresAt);

  const updateOtp = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        verification: {
          otp,
          expiresAt,
          status: false,
        },
      },
    },
    { new: true }
  );

  if (!updateOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to resend OTP. Please try again later"
    );
  }

  const jwtPayload = {
    email: user?.email,
    userId: user?._id,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: "3m",
  });
  const otpEmailPath = path.resolve(
    process.cwd(),
    "src",
    "app",
    "public",
    "view",
    "otp_mail.html"
  );

  if (user) {
    await sendEmail(
      user?.email,
      "Your One Time OTP",
      fs
        .readFileSync(otpEmailPath, "utf8")
        .replace("{{otp}}", otp)
        .replace("{{email}}", user?.email)
    );
  }

  return { token };
};

export const otpServices = {
  verifyOtp,
  resendOtp,
};
