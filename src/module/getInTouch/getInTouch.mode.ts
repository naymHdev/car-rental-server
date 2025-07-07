import { model, Schema } from "mongoose";
import { IGetInTouch } from "./getInTouch.interface";

//  ---------------------------------------------- Get In Touch ----------------------------------------------
const createGetInTouchSchema = new Schema<IGetInTouch>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const GetInTouch = model<IGetInTouch>(
  "GetInTouch",
  createGetInTouchSchema
);
