import nodemailer from "nodemailer";

if (!process.env.APP_EMAIL || !process.env.APP_PASSWORD) {
    throw new Error("Email configuration is missing.");
}

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

export const sendVerificationEmail = async (
  to: string,
  code: string,
  purpose: 'registration' | 'password_reset' | 'email_change' | 'general' = 'general'
) => {
  const subjectMap = {
    registration: 'Welcome to Mango Lens - Email Verification',
    password_reset: 'Mango Lens - Password Reset Code',
    email_change: 'Mango Lens - Email Change Verification',
    general: 'Mango Lens - Verification Code',
  };

  const introMap = {
    registration: 'Thank you for registering with Mango Lens.',
    password_reset: 'You recently requested to reset your Mango Lens account password.',
    email_change: 'You recently requested to change your email address on Mango Lens.',
    general: 'Please use the verification code below to proceed with your request on Mango Lens.',
  };

  const subject = subjectMap[purpose] || subjectMap.general;
  const intro = introMap[purpose] || introMap.general;

  const mailOptions = {
    from: {
      name: 'Mango Lens',
      address: process.env.APP_EMAIL as string,
    },
    to: to,
    subject: subject,
    text:
      `Dear valued user,\n\n` +
      `${intro}\n\n` +
      `Your verification code is:\n\n` +
      `${code}\n\n` +
      `This code will expire in 1 hour. If you did not initiate this request, please ignore this email.\n\n` +
      `Best regards,\n` +
      `The Mango Lens Team`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${subject}</h2>
      <p>Dear valued user,</p>
      <p>${intro}</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
        <h1 style="color: #4a90e2; margin: 0;">${code}</h1>
      </div>
      <p>This code will expire in 24 hours. If you did not initiate this request, please ignore this email.</p>
      <p>Best regards,<br>The Mango Lens Team</p>
    </div>`,
  };

  await transporter.sendMail(mailOptions);
};

;
