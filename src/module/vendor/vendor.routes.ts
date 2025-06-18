import express from "express";
import VendorController from "./vendor.controller";

const router = express.Router();

router.get(
  "/get_vendor",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  VendorController.getVendor
);
router.get(
  "/get_all_vendor",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  VendorController.getAllVendor
);
router.patch(
  "/update_vendor",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  VendorController.updateVendor
);

router.delete(
  "/delete_vendor",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  VendorController.deleteVendor
);

const VendorRouter = router;
export default VendorRouter;
