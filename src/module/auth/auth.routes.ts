import express from "express";
import AuthController from "./auth.controller";
import validateRequest from "../../middleware/validationRequest";
import AuthValidationSchema from "./auth.validation";

const router = express.Router();

router.post("/signup", AuthController.signUp);

router.post("/login", AuthController.login);

router.post(
  "/forgot-password",
  AuthController.fagotPassword,
  validateRequest(AuthValidationSchema.forgotPassValidation)
);

router.post(
  "/reset-password",
  AuthController.resetPassword,
  validateRequest(AuthValidationSchema.resetPassValidation)
);

const AuthRouter = router;

export default AuthRouter;
