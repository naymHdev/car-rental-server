import Stripe from "stripe";
import config from "../../app/config";
import { Types } from "mongoose";

const stripe = new Stripe(config.stripe?.secretKey as string, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

interface IPayload {
  product: {
    amount: number;
    name: string;
    quantity: number;
  };
  // customerId: string;
  paymentId: Types.ObjectId;
}
export const createCheckoutSession = async (payload: IPayload) => {
  const paymentGatewayData = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: payload?.product?.name,
          },
          unit_amount: Math.round(payload.product?.amount * 100),
        },
        quantity: payload.product?.quantity,
      },
    ],

    success_url: `${config.base_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${payload?.paymentId}`,
    cancel_url: `${config?.stripe.client_Url}${config?.stripe?.cancel_url}`,

    // `${config.server_url}/payments/cancel?paymentId=${payload?.paymentId}`,
    mode: "payment",
    // metadata: {
    //   user: JSON.stringify({
    //     paymentId: payment.id,
    //   }),
    // },
    invoice_creation: {
      enabled: true,
    },
    // customer: payload?.customerId,
    // payment_intent_data: {
    //   metadata: {
    //     payment: JSON.stringify({
    //       ...payment,
    //     }),
    //   },
    // },
    // payment_method_types: ['card', 'amazon_pay', 'cashapp', 'us_bank_account'],
    payment_method_types: ["card"], //, 'paypal'
  });
  return paymentGatewayData;
};
