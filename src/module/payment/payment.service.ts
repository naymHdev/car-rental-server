import { IPayment } from "./payment.interface";
import { Payment } from "./payment.model";

const makePayment = async (payload: IPayment, userId: string) => {
  const result = await Payment.create({ ...payload, userId });

  return result;
};

export const PaymentServices = {
  makePayment,
};
