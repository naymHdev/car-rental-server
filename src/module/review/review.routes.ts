import express from "express";
import ReviewController from "./review.controller";

const router = express.Router();

router.post("/add_review", ReviewController.addReview);
router.get("/get_review", ReviewController.findReview);
router.get("/get_all_review", ReviewController.findAllReview);

const ReviewRouter = router;
export default ReviewRouter;
