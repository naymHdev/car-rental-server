import express from "express";
import validationRequest from "../../middleware/validationRequest";
import AuthValidationSchema from "./auth.validation";
import AuthController from "./auth.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get(
  "/profile",
  auth("Vendor", "Admin", "User"),
  AuthController.myProfile
);

router.post("/signup", AuthController.signUp);

router.post("/login", AuthController.login);

router.post(
  "/forgot_password",
  validationRequest(AuthValidationSchema.forgotPasswordValidation),
  AuthController.requestForgotPassword
);

router.post(
  "/verify_otp",
  validationRequest(AuthValidationSchema.verifyOtpdValidation),
  AuthController.verifyOtp
);

router.put(
  "/reset_password",
  validationRequest(AuthValidationSchema.resetPasswordValidation),
  AuthController.resetPassword
);

router.patch(
  "/update_password",
  validationRequest(AuthValidationSchema.updatePasswordValidation),
  AuthController.updatePassword
);

const AuthRouter = router;

export default AuthRouter;
