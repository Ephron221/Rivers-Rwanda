import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: `"Rivers Rwanda" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your OTP for Email Verification',
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        html: `<b>Your OTP is: ${otp}</b>. It will expire in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent to', to);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email');
    }
};