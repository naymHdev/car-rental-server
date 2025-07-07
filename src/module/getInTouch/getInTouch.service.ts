import { IGetInTouch } from "./getInTouch.interface";
import { GetInTouch } from "./getInTouch.mode";
// import { sendEmail } from "./getInTouch.utils";
import config from "../../app/config";
import { sendEmail } from "../../utility/mailSender";
import QueryBuilder from "../../app/builder/QueryBuilder";

const createGetInTouch = async (payload: IGetInTouch) => {
  const result = await GetInTouch.create(payload);

  //   ---------------------- Email Template ----------------------
  const emailSubject = `📩 New Contact Message from ${payload.firstName} ${payload.lastName}`;
  const emailBody = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4CAF50;">📬 New User Message</h2>

    <p><strong>Sender Name:</strong> ${payload.firstName} ${payload.lastName}</p>
    <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
    <p><strong>Phone Number:</strong> ${payload.phoneNumber}</p>

    <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #4CAF50;">
      <p style="margin: 0;"><strong>Message:</strong></p>
      <p style="margin: 0;">${payload.message}</p>
    </div>

    <p>🚀 Please log in to the admin dashboard to respond or take action on this inquiry.</p>

    <br/>
    <p>Regards,<br/><strong>Ami Pets System Bot 🐾</strong></p>

    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">
      This message was auto-generated from the "Get In Touch" form on the Ami Pets website.
    </p>
  </div>
`;

  await sendEmail(
    config.nodemailer_host_email as string,
    emailSubject,
    emailBody
  );

  return result;
};

const findAllMessages = async (query: Record<string, unknown>) => {
  const { ...mQuery } = query;
  const baseQuery = GetInTouch.find({});

  const messageQuery = new QueryBuilder(baseQuery, mQuery)
    .search([])
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await messageQuery.modelQuery;
  const meta = await messageQuery.countTotal();

  return { meta, messages: result };
};

const deleteMessage = async (id: string) => {
  const result = await GetInTouch.findByIdAndDelete(id);
  return result;
};

export const GetInTouchServices = {
  createGetInTouch,
  findAllMessages,
  deleteMessage,
};
