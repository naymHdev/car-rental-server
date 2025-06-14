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
    CarController.addNewCar
);

router.get(
    '/get_all_car',
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.addNewCar
);

router.patch(
    '/update_car',
    auth('Vendor'),
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.addNewCar
);

router.delete(
    '/delete_car',
    auth('Vendor'),
    // validationRequest(AuthValidationSchema.playerSignUpValidation),
    CarController.addNewCar
);
const CarRouter = router;
export default CarRouter;
