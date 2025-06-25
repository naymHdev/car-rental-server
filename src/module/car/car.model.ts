import { model, Schema, Model } from "mongoose";
import { GearType, ICar, IMileage, IPriceOption } from "./car.interface";
import MongooseHelper from "../../utility/mongoose.helpers";
import { LocationSchema } from "../user/user.model";

const PriceOptionSchema = new Schema<IPriceOption>(
  {
    select: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const MileageSchema = new Schema<IMileage>(
  {
    rate: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { _id: false }
);

const CarSchema: Schema = new Schema<ICar>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    carName: { type: String, required: true },
    description: { type: String, required: true },
    rentingLocation: { type: LocationSchema, required: true },
    carAmenities: { type: [String], required: true },
    model: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    mileage: { type: MileageSchema, required: true },
    seat: { type: Number, required: true },
    door: { type: Number, required: true },
    vin: { type: String, required: true },
    fuel: { type: Number, required: true },
    fuelType: [{ type: String, required: true }],
    gearType: { type: String, enum: Object.values(GearType), required: true },
    bodyStyle: [{ type: String, required: true }],
    carImage: [{ type: String, required: true }],
    childSeat: { type: PriceOptionSchema, required: true },
    additionalDriver: { type: PriceOptionSchema, required: true },
    youngDriver: { type: PriceOptionSchema, required: true },
    oneWayFees: { type: PriceOptionSchema, required: true },
    gps: { type: PriceOptionSchema, required: true },
    crossBorder: { type: PriceOptionSchema, required: true },
    // draft: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
MongooseHelper.applyToJSONTransform(CarSchema);
MongooseHelper.findExistence(CarSchema);

const Car: Model<ICar> = model<ICar>("Car", CarSchema);

export default Car;
