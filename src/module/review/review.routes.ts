import express from "express";
import ReviewController from "./review.controller";

const router = express.Router();

router.post("/add_review", ReviewController.addReview);
router.get("/get_review", ReviewController.findReview);
router.get("/get_all_review", ReviewController.findAllReview);
router.get("/single_review/:id", ReviewController.getSingleReview);
router.get("/average_review", ReviewController.getAverageReview);

const ReviewRouter = router;
export default ReviewRouter;
