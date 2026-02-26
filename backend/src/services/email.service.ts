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

export const sendSaleConfirmationEmail = async (to: string, data: { 
    propertyName: string, 
    amount: number, 
    systemFee: number, 
    agentFee: number, 
    netAmount: number 
}) => {
    const mailOptions = {
        from: `"Rivers Rwanda" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Sale Confirmation - Rivers Rwanda',
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #f59e0b; text-transform: uppercase; letter-spacing: 2px;">Property Sold!</h2>
                </div>
                <p>Hello,</p>
                <p>Great news! A payment for your property <b>${data.propertyName}</b> has been confirmed by our administration.</p>
                
                <div style="background: #fdfaf6; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #fef3c7;">
                    <h3 style="margin-top: 0; color: #b45309; font-size: 14px; text-transform: uppercase;">Transaction Breakdown</h3>
                    
                    <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                        <span>Gross Amount:</span>
                        <span style="font-weight: bold;">Rwf ${data.amount.toLocaleString()}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin: 10px 0; color: #ef4444;">
                        <span>System Fee (10%):</span>
                        <span>- Rwf ${data.systemFee.toLocaleString()}</span>
                    </div>
                    
                    ${data.agentFee > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin: 10px 0; color: #ef4444;">
                        <span>Agent Commission (5%):</span>
                        <span>- Rwf ${data.agentFee.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    
                    <hr style="border: 0; border-top: 1px solid #fde68a; margin: 15px 0;">
                    
                    <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 18px; color: #059669; font-weight: bold;">
                        <span>Total Payout:</span>
                        <span>Rwf ${data.netAmount.toLocaleString()}</span>
                    </div>
                </div>
                
                <p style="font-size: 14px; color: #666;">The net payout will be transferred to your registered payment method within 2-3 business days.</p>
                
                <p style="margin-top: 30px;">Thank you for partnering with us.</p>
                <p>Best Regards,<br><b>Rivers Rwanda Management</b></p>
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
