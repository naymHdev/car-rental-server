import { z } from "zod";

const locationValidation = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  streetAddress: z.string().optional(),
  zipCode: z.string().optional(),
});

const carUpdateValidation = z.object({
  body: z.object({
    vendor: z.string().optional(),
    reviews: z.array(z.string()).optional(),
    carName: z.string().optional(),
    description: z.string().optional(),
    rentingLocation: locationValidation.optional(),
    carAmenities: z.array(z.string()).optional(),
    discount: z.number().optional(),
    model: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().optional(),
    mileage: z
      .object({
        rate: z.number().optional(),
        type: z.string().optional(),
      })
      .optional(),
    seat: z.number().optional(),
    door: z.number().optional(),
    vin: z.string().optional(),
    fuel: z.number().optional(),
    fuelType: z.string().optional(),
    gearType: z.enum(["Manual", "Automatic"]).optional(),
    bodyStyle: z.array(z.string()).optional(),
    carImage: z.array(z.string().optional()).optional(),
    childSeat: z
      .object({ select: z.number().optional(), price: z.number().optional() })
      .optional(),
    additionalDriver: z
      .object({ select: z.number().optional(), price: z.number().optional() })
      .optional(),
    youngDriver: z
      .object({ select: z.number().optional(), price: z.number().optional() })
      .optional(),
    oneWayFees: z
      .object({ select: z.number().optional(), price: z.number().optional() })
      .optional(),
    gps: z
      .object({
        select: z.number().optional(),
        price: z.number().optional(),
      })
      .optional(),
    crossBorder: z
      .object({ select: z.number().optional(), price: z.number().optional() })
      .optional(),
    published: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const carValidation = {
  carUpdateValidation,
};
