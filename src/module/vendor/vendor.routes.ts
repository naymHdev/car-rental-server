import express from "express";
import VendorController from "./vendor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/get_vendor", VendorController.getVendor);
router.get("/get_all_vendor", VendorController.getAllVendor);
router.patch("/update_vendor", VendorController.updateVendor);
router.get("/my-rents", auth("Vendor"), VendorController.findMyRents);

router.delete("/delete_vendor", VendorController.deleteVendor);

const VendorRouter = router;
export default VendorRouter;
