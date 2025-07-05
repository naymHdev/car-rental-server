import { Router } from 'express';
import { otpController } from './otp.controller';
import { otpValidation } from './otp.validation';
import validateRequest from '../../middleware/validationRequest';

const router = Router();

router.post(
  '/verify-otp',
  otpController.verifyOtp,
  validateRequest(otpValidation.otpVerifySchema),
);

router.post(
  '/resend-otp',
  otpController.resendOtp,
  validateRequest(otpValidation.otpResendSchema),
);

export const OtpRoutes = router;
