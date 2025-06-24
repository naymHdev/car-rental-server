import express from "express";
import CarController from "./car.controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/multer/multer";
import { fileHandle } from "../../middleware/fileHandle";

const router = express.Router();

router.post(
  "/add_new_car",
  auth("Vendor"),
  upload.fields([{ name: "carImage", maxCount: 5 }]),
  fileHandle("carImage"),
  CarController.addNewCar
);

router.get("/car-details/:id", CarController.findCar);

router.get("/get_all_car", CarController.findAllCar);

router.patch(
  "/update_car",
  auth("Vendor"),
  upload.fields([{ name: "carImage", maxCount: 5 }]),
  fileHandle("carImage"),
  CarController.updateCar
);

router.delete("/delete_car", auth("Vendor"), CarController.deleteCar);

router.get("/locations", CarController.getAllLocations);

const CarRouter = router;
export default CarRouter;
