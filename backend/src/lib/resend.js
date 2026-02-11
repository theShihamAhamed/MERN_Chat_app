import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

const EMAIL_FROM = process.env.EMAIL_FROM;
if (!EMAIL_FROM) {
  throw new Error("EMAIL_FROM is not defined");
}

const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME;
if (!EMAIL_FROM_NAME) {
  throw new Error("EMAIL_FROM_NAME is not defined");
}

export const resendClient = new Resend(RESEND_API_KEY);

export const sender = {
  email: EMAIL_FROM,
  name: EMAIL_FROM_NAME,
};
