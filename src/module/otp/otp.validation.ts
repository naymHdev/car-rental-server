import { z } from 'zod';

const otpVerifySchema = z.object({
  headers: z.object({
    token: z.string().min(1, 'token is not found in header'),
  }),
  body: z.object({
    otp: z.string().min(1, 'otp token is required'),
  }),
});

const otpResendSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid Email').min(1, 'Email is required'),
  }),
});

export const otpValidation = {
  otpVerifySchema,
  otpResendSchema,
};
