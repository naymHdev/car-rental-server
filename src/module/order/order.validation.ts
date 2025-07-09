import { z } from "zod";

const orderUpdateSchema = z.object({
  body: z.object({
    pickUp: z.date().optional(),
    dropOff: z.date().optional(),
    pickUpLocation: z.string().optional(),
    dropOffLocation: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const orderValidation = {
  orderUpdateSchema,
};
