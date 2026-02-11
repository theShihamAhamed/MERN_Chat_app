import logger from "../../lib/logger.js";
import { resendClient, sender } from "../../lib/resend.js";
import { createWelcomeEmailTemplate } from "./createWelcomeEmailTemplate.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Toki!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    logger.error(error, "Error sending welcome email:");
  }
};
