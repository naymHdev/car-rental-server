import express from 'express';
import CarController from './car.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
    '/add_new_car',
    auth('Vendor'),
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.addNewCar
);

router.get(
    '/get_car',
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.findCar
);

router.get(
    '/get_all_car',
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.findAllCar
);

router.patch(
    '/update_car',
    auth('Vendor'),
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.updateCar
);

router.delete(
    '/delete_car',
    auth('Vendor'),
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.deleteCar
);

const CarRouter = router;
export default CarRouter;
