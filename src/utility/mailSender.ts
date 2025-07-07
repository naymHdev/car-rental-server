import nodemailer from "nodemailer";
import config from "../app/config";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: process.env.EMAIL_ENV === "production" ? 465 : 587,
    secure: process.env.EMAIL_ENV === "production",
    auth: {
      user: config.nodemailer_host_email,
      pass: config.nodemailer_host_pass,
    },
  });

  await transporter.sendMail({
    from: "naymhossen09@gmail.com",
    to,
    subject,
    text: "",
    html,
  });
};


export const sendEmails = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.nodemailer_host_email,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ami Pets" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
