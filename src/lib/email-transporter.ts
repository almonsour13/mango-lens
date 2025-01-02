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

export const sendVerificationEmail = async (to: string, code: string) => {
    const mailOptions = {
        from: {
            name: "Mango Lens",
            address: process.env.APP_EMAIL as string,
        },
        to: to,
        subject: "Welcome to Mango Lens - Email Verification",
        text:
            `Dear valued customer,\n\n` +
            `Thank you for registering with Mango Lens. To complete your registration, please use the following verification code:\n\n` +
            `${code}\n\n` +
            `This code will expire in 24 hours. If you did not request this verification, please ignore this email.\n\n` +
            `Best regards,\n` +
            `The Mango Lens Team`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Mango Lens</h2>
        <p>Dear valued customer,</p>
        <p>Thank you for registering with Mango Lens. To complete your registration, please use the following verification code:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
        <h1 style="color: #4a90e2; margin: 0;">${code}</h1>
        </div>
        <p>This code will expire in 24 hours. If you did not request this verification, please ignore this email.</p>
        <p>Best regards,<br>The Mango Lens Team</p>
    </div>`,
    };
    await transporter.sendMail(mailOptions);
};

export const sendForgotPasswordEmail = async (to: string, code: string) => {
    const mailOptions = {
        from: {
            name: "Mango Lens",
            address: process.env.APP_EMAIL as string,
        },
        to: to,
        subject: "Mango Lens - Password Reset Verification Code",
        text:
            `Dear valued customer,\n\n` +
            `We received a request to reset your password for your Mango Lens account. To proceed with the password reset, please use the following verification code:\n\n` +
            `${code}\n\n` +
            `This code will expire in 24 hours. If you did not request this password reset, please ignore this email or contact our support team.\n\n` +
            `Best regards,\n` +
            `The Mango Lens Team`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Verification</h2>
        <p>Dear valued customer,</p>
        <p>We received a request to reset your password for your Mango Lens account. To proceed with the password reset, please use the following verification code:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
        <h1 style="color: #4a90e2; margin: 0;">${code}</h1>
        </div>
        <p>This code will expire in 24 hours. If you did not request this password reset, please ignore this email or contact our support team.</p>
        <p>Best regards,<br>The Mango Lens Team</p>
    </div>`,
    };
    await transporter.sendMail(mailOptions);
};
