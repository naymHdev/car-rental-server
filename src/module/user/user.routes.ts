import express from "express";
import UserController from "./user.controller";

const router = express.Router();

router.get(
  "/get_user",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  UserController.getUser
);
router.get(
  "/get_all_user",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  UserController.getAllUser
);
router.patch(
  "/update_user",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  UserController.updateUser
);

router.delete(
  "/delete_user",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  UserController.deleteUser
);

const UserRouter = router;
export default UserRouter;
