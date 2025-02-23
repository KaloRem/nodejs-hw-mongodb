import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔗 SMTP_HOST:', process.env.SMTP_HOST);
console.log('🔑 SMTP_USER:', process.env.SMTP_USER);
console.log(
  '🔒 SMTP_PASSWORD:',
  process.env.SMTP_PASSWORD ? '********' : 'Brak wartości!',
);
console.log('📨 SMTP_FROM:', process.env.SMTP_FROM);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetEmail = async (email, token) => {
  try {
    if (!process.env.APP_DOMAIN) {
      throw new Error('APP_DOMAIN is not defined in .env!');
    }
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    console.log('🔗 Link resetowania:', resetLink); // Debugowanie

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Password',
      text: `${resetLink}`,
      html: `<a href="${resetLink}" target="_blank">${resetLink}</a>`,
      // text: `Click the link below to reset your password:\n\n${resetLink}`,
      // html: `
      //   <p>Click the link below to reset your password:</p>
      //   <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
      //   <p>If you did not request a password reset, please ignore this email.</p>
      // `,
    });

    console.log(`✅ Email z resetem wysłany do: ${email}`);
  } catch (error) {
    console.error('❌ Błąd wysyłania e-maila:', error);
    throw new Error('Failed to send reset email.');
  }
};
