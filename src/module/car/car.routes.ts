import express from "express";
import CarController from "./car.controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/multer/multer";
import { fileHandle } from "../../middleware/fileHandle";
import validationRequest from "../../middleware/validationRequest";
import { carValidation } from "./car.validation";

const router = express.Router();

router.post(
  "/add_new_car",
  auth("Vendor"),
  upload.fields([{ name: "carImage", maxCount: 10 }]),
  fileHandle("carImage"),
  CarController.addNewCar
);

router.get("/car-details/:id", CarController.findCar);
router.get("/car-reviews/:id", CarController.singleCarReview);
router.get("/get_all_car", CarController.findAllCar);
router.get("/single-car-reviews/:id", CarController.getSingleCarReviews);
router.get("/my-cars", auth("Vendor"), CarController.getMyCars);

router.patch(
  "/update_car/:id",
  auth("Vendor"),
  upload.fields([{ name: "carImage", maxCount: 10 }]),
  fileHandle("carImage"),
  validationRequest(carValidation.carUpdateValidation),
  CarController.updateCar
);
router.delete("/carImage/:id", auth("Vendor"), CarController.deleteCarImages);

router.patch("/delete_car/:id", auth("Vendor"), CarController.deleteCar);

router.get("/locations", CarController.getAllLocations);
router.get("/car_brands", CarController.getCarBrands);
router.get("/car_types", CarController.getCarTypes);
router.get("/fuel_types", CarController.getFuelTypes);

const CarRouter = router;
export default CarRouter;
