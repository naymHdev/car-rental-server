import { Router } from "express";
import validateRequest from "../../middleware/validationRequest";
import { GetInTouchValidation } from "./getInTouch.validation";
import { GetInTouchController } from "./getInTouch.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/get_in_touch",
  validateRequest(GetInTouchValidation.getTouchValidation),
  GetInTouchController.createGetInTouch
);

router.get(
  "/all-messages",
  auth("Vendor", "Admin"),
  GetInTouchController.findAllMessages
);

router.delete(
  "/delete-message/:id",
  auth("Vendor", "Admin"),
  GetInTouchController.deleteMessage
);

export const GetInTouchRouter = router;
