import express from "express";
import InsuranceController from "./insurance.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create_insurance",
  auth("Admin"),
  InsuranceController.createInsurance
);

router.get(
  "/get_insurance",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  InsuranceController.getInsurance
);
router.get(
  "/get_all_insurance",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  InsuranceController.getAllInsurance
);
router.patch(
  "/update_insurance",
  auth("Admin"),
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  InsuranceController.updateInsurance
);

router.delete(
  "/delete_insurance",
  auth("Admin"),
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  InsuranceController.deleteInsurance
);

const InsuranceRouter = router;
export default InsuranceRouter;
