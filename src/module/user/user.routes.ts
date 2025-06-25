import express from "express";
import UserController from "./user.controller";
import { upload } from "../../middleware/multer/multer";
import { fileHandle } from "../../middleware/fileHandle";

const router = express.Router();

router.get("/get_user", UserController.getUser);
router.get("/get_all_user", UserController.getAllUser);
router.patch(
  "/update_user",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  fileHandle("photo"),
  UserController.updateUser
);

router.delete("/delete_user", UserController.deleteUser);

const UserRouter = router;
export default UserRouter;
