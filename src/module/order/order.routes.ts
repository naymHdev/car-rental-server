import express from "express";
import OrderController from "./order.controller";

const router = express.Router();

router.post("/add_new_order");

router.get(
  "/get_order",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  OrderController.findAllOrder
);
router.get(
  "/get_all_order",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  OrderController.findOrder
);
router.patch(
  "/update_order_status",
  //   validationRequest(AuthValidationSchema.playerSignUpValidation),
  OrderController.updateOrder
);

const OrderRouter = router;
export default OrderRouter;
