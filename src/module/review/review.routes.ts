import express from "express";
import ReviewController from "./review.controller";

const router = express.Router();

router.post(
  "/add_review",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  ReviewController.addReview
);
router.get(
  "/get_review",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  ReviewController.findReview
);
router.get(
  "/get_all_review",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  ReviewController.findAllReview
);

const ReviewRouter = router;
export default ReviewRouter;
