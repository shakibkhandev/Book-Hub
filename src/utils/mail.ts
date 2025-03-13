import dotenv from "dotenv";
import Mailgen, { Content } from "mailgen";
import nodemailer from "nodemailer";
import logger from "../logger/winston.log";

dotenv.config();

// Define a type for the options parameter
interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: Content; // Import the Content type from mailgen to ensure proper structure
}

/**
 * Function to send email using Mailgen and Nodemailer
 * @param options - Email options containing recipient email, subject, and mailgen content
 */
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  // Initialize Mailgen instance with default theme and brand configuration
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Book Hub",
      link: "https://apibookhub.vercel.app",
    },
  });

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  // Generate an HTML email with the provided contents
  const emailHtml = mailGenerator.generate(options.mailgenContent);


  let transporter;

  if(process.env.NODE_ENV === 'production'){
    // Create a Nodemailer transporter instance which is responsible to send a mail
     transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: Number(process.env.MAILTRAP_SMTP_PORT), // Ensure port is treated as a number
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

  }else{
     transporter = nodemailer.createTransport({
      host: process.env.MAILHOG_SMTP_HOST,
      port: Number(process.env.MAILHOG_SMTP_PORT), // Ensure port is treated as a number
    });
  }

  const mail = {
    from: "api.bookhub@gmail.com", // Sender's email
    to: options.email, // Receiver's email
    subject: options.subject, // Subject of the email
    text: emailTextual, // Text version of the email
    html: emailHtml, // HTML version of the email
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    // Fail silently rather than breaking the app
    logger.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
    );
    logger.error("Error: ", error);
  }
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
 */
export const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
