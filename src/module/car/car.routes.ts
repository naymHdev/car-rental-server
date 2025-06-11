import express from 'express';

const router = express.Router();

router.post(
    '/add_new_car',
    validationRequest(AuthValidationSchema.playerSignUpValidation),
    AuthController.playerSignUp,
);

const CarRouter = router;
export default CarRouter;
