import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: Number(process.env.MAILTRAP_SMTP_PORT),
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "Inngest Ticketing System <noreply@inngest.com>",
      to,
      subject,
      text,
    });

    console.log("Message sent: " + info.messageId);
    return info;
  } catch (error: any) {
    console.error("Mail error: " + error.message);
    throw error;
  }
};
