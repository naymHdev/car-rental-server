import express from "express";
import AuthController from "./auth.controller";
import validateRequest from "../../middleware/validationRequest";
import AuthValidationSchema from "./auth.validation";

const router = express.Router();

router.post("/signup", AuthController.signUp);

router.post("/login", AuthController.login);

router.post(
  "/forgot-password",
  validateRequest(AuthValidationSchema.forgotPassValidation),
  AuthController.fagotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidationSchema.resetPassValidation),
  AuthController.resetPassword
);

const AuthRouter = router;

export default AuthRouter;
