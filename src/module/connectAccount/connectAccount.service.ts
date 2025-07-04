import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import config from "../../app/config";
import stripe from "../../app/config/stripe.config";

 
const stripLinkAccount = async (userId: string, query: Record<string, any>) => {
  const user = await prisma.user.findFirst({ where: { id: userId } });
 
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
  }
 
  try {
    const account = await stripe.accounts.create({});
    let returnURL = `${config?.serverUrl}/api/v1/stripe/return/${account.id}?userId=${user?.id}`;
    let refreshURL = `${config?.serverUrl}/api/v1/stripe/refresh/${account.id}?userId=${user?.id}`;
    if (query?.redirectPath) {
      returnURL = `${config?.serverUrl}/api/v1/stripe/return/${account.id}?userId=${user?.id}&redirectPath=${query?.redirectPath}`;
      refreshURL = `${config?.serverUrl}/api/v1/stripe/refresh/${account.id}?userId=${user?.id}&redirectPath=${query?.redirectPath}`;
    }
 
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: returnURL,
      refresh_url: refreshURL,
      type: "account_onboarding",
    });
 
    return accountLink.url;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  }
};
 
const refresh = async (paymentId: string, query: Record<string, any>) => {
  const user = await prisma.user.findFirst({ where: { id: query.userId } });
 
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
  }
 
  try {
    const account = await stripe.accounts.create({});
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: `${config?.serverUrl}/api/v1/stripe/return/${account.id}?userId=${user?.id}`,
      refresh_url: `${config?.serverUrl}/api/v1/stripe/refresh/${account.id}?userId=${user?.id}`,
      type: "account_onboarding",
    });
    return accountLink.url;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  }
};
 
const returnUrl = async (
  stripeAccountId: string,
  payload: {
    userId: string;
    redirectPath?: string;
  },
) => {
  try {
    const result = await prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        stripeAccountId: stripeAccountId,
      },
    });
 
    console.log(result, "after connect stripe");
 
    let url = `${config?.websiteUrl}?userId=${payload.userId}?`;
 
    if (payload.redirectPath) {
      url = `${config?.websiteUrl}/${payload.redirectPath}?userId=${payload.userId}?`;
    }
 
    return {
      url,
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};
 
export const createTransfer = async ({
  amount,
  stripeAccountId,
}: {
  amount: number;
  stripeAccountId: string;
}) => {
  try {
    const balance = await stripe.balance.retrieve();
    const availableBalance = balance.available.reduce((total, bal) => total + bal.amount, 0);
    if (availableBalance < amount) {
      console.log("Insufficient funds to cover the transfer.");
      throw new AppError(httpStatus?.BAD_REQUEST, "Insufficient funds to cover the transfer.");
    }
 
    return await stripe.transfers.create({
      amount,
      currency: "eur",
      destination: stripeAccountId,
    });
  } catch (error) {
    console.error(error);
  }
};
 
export const ConnectAccountServices = { stripLinkAccount, refresh, returnUrl, createTransfer };