import nodemailer from "nodemailer";

const createTransporter = () =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

export const sendOtpEmail = async (to, otp) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Food Management System" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your Password Reset OTP",
        text: `Your OTP is: ${otp}\n\nThis code expires in 15 minutes. Do not share it with anyone.`,
        html: `
            <p>You requested a password reset.</p>
            <p><strong>Your OTP: <span style="font-size:1.4em;letter-spacing:4px">${otp}</span></strong></p>
            <p>This code expires in <strong>15 minutes</strong>. Do not share it with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    });
};
