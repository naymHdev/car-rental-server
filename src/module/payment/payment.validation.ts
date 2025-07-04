import { z } from "zod";

const paymentValidation = z.object({
  body: z.object({
    orderId: z.string({ required_error: "Order id is required" }),
    userId: z.string({ required_error: "User id is required" }),
    subTotal: z.number({ required_error: "Sub total is required" }),
    discount: z.number({ required_error: "Discount is required" }),
    total: z.number({ required_error: "Total is required" }),
    paymentOption: z.enum(["creditCard", "paypal", "applePay"], {
      required_error: "Payment option is required",
    }),
  }),
});

export const PaymentValidation = {
  paymentValidation,
};
