import express from "express";
import OrderController from "./order.controller";
import auth from "../../middleware/auth";
import { ERole } from "../auth/auth.interface";

const router = express.Router();

router.post("/add_new_order", auth(ERole.USER), OrderController.addOrder);

router.get("/get_order", OrderController.findAllOrder);
router.get("/get_all_order", OrderController.findOrder);
router.patch("/update_order_status", OrderController.updateOrder);

const OrderRouter = router;
export default OrderRouter;
