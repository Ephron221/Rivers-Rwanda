import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, 
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

export const sendSaleConfirmationEmail = async (to: string, data: { propertyName: string, amount: number, commission: number, netAmount: number }) => {
    const mailOptions = {
        from: `"Rivers Rwanda" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Sale Confirmation - Rivers Rwanda',
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2 style="color: #f59e0b;">Congratulations! Your Property Has Been Sold/Rented</h2>
                <p>Hello,</p>
                <p>We are pleased to inform you that a payment for your property <b>${data.propertyName}</b> has been confirmed.</p>
                <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #eee;">
                    <p style="margin: 5px 0;"><b>Total Amount:</b> Rwf ${data.amount.toLocaleString()}</p>
                    <p style="margin: 5px 0;"><b>System Commission (10%):</b> Rwf ${data.commission.toLocaleString()}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p style="margin: 5px 0; font-size: 18px; color: #059669;"><b>Net Amount to Payout:</b> Rwf ${data.netAmount.toLocaleString()}</p>
                </div>
                <p>The funds will be processed and transferred to your registered payment details shortly.</p>
                <p>Thank you for choosing Rivers Rwanda.</p>
                <br>
                <p>Best Regards,<br>Rivers Rwanda Team</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Sale confirmation email sent to', to);
    } catch (error) {
        console.error('Error sending sale confirmation email:', error);
    }
};
