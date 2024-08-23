import { emailConfig } from '@config';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (emailOptions: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false, // set to true if your server requires SSL/TLS
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  });

  const mailOptions = {
    from: emailConfig.user,
    to: emailOptions.to,
    subject: emailOptions.subject,
    text: emailOptions.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error:', error);
    throw error; // Propagate the error to the caller
  }
};
