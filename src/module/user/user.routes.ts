import express from "express";
import UserController from "./user.controller";
import { upload } from "../../middleware/multer/multer";
import { fileHandle } from "../../middleware/fileHandle";
import auth from "../../middleware/auth";
import { ERole } from "../auth/auth.interface";

const router = express.Router();

router.get(
  "/profile",
  auth(ERole.VENDOR, ERole.ADMIN, ERole.USER),
  UserController.myProfile
);

router.get("/get_user", UserController.getUser);
router.get("/get_all_user", UserController.getAllUser);
router.patch(
  "/update_user",
  auth(ERole.VENDOR, ERole.ADMIN, ERole.USER),
  upload.fields([{ name: "photo", maxCount: 1 }]),
  fileHandle("photo"),
  UserController.updateUser
);

router.delete("/delete_user", UserController.deleteUser);

//  ---------------------------------------------- Get In Touch ----------------------------------------------

const UserRouter = router;
export default UserRouter;
