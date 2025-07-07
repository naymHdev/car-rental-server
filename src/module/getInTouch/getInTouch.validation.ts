import { z } from "zod";

const getTouchValidation = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email({ message: "Provide a valid email, try again" }),
    phoneNumber: z.string().min(1, "Phone number is required"),
    message: z.string().min(1, "Message is required"),
  }),
});

export const GetInTouchValidation = {
  getTouchValidation,
};
