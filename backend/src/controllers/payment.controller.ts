import { Request, Response, NextFunction } from 'express';
import { query } from '../database/connection';
import * as BookingModel from '../models/Booking.model';
import * as CommissionModel from '../models/Commission.model';

// Placeholder for a real payment gateway integration
const callPaymentGateway = async (amount: number, currency: string, description: string) => {
    console.log(`Initiating payment of ${amount} ${currency} for ${description}`);
    return `txn_${Date.now()}`;
};

export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.body;
        const userId = (req as any).user.id;

        const booking = await BookingModel.getBookingById(bookingId);
        if (!booking || booking.client_id !== userId) {
            return res.status(404).json({ success: false, message: 'Booking not found or access denied.' });
        }

        if (booking.payment_status === 'paid') {
            return res.status(400).json({ success: false, message: 'This booking has already been paid.' });
        }

        const transactionRef = await callPaymentGateway(booking.total_amount, 'USD', `Booking for ${booking.booking_type}`);

        const paymentResult = await query(
            'INSERT INTO payments (id, booking_id, amount, payment_method, transaction_id, status) VALUES (UUID(), ?, ?, ?, ?, ?)',
            [bookingId, booking.total_amount, 'mobile_money', transactionRef, 'pending']
        );

        res.status(200).json({ 
            success: true, 
            message: 'Payment initiated.', 
            data: {
                transactionReference: transactionRef,
                paymentId: (paymentResult as any).insertId
            }
        });

    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paymentId, transactionReference } = req.body;

        const isPaymentSuccessful = true; // Assume success for this simulation

        if (!isPaymentSuccessful) {
            await query("UPDATE payments SET status = 'failed' WHERE id = ?", [paymentId]);
            return res.status(400).json({ success: false, message: 'Payment confirmation failed.' });
        }

        await query("UPDATE payments SET status = 'completed', verified_at = CURRENT_TIMESTAMP WHERE id = ?", [paymentId]);
        const [payment] = await query<any[]>('SELECT booking_id FROM payments WHERE id = ?', [paymentId]);
        await BookingModel.updateBookingStatus(payment[0].booking_id, 'confirmed');
        await query("UPDATE bookings SET payment_status = 'paid' WHERE id = ?", [payment[0].booking_id]);

        // Correctly handle booking object and create commission ONLY for agents
        const booking = await BookingModel.getBookingById(payment[0].booking_id);
        if (booking && booking.agent_id) {
            const commissionAmount = booking.total_amount * 0.05; // 5% commission for Agents
            await CommissionModel.createCommission({
                agent_id: booking.agent_id,
                booking_id: booking.id,
                amount: commissionAmount,
            });
        }

        res.status(200).json({ success: true, message: 'Payment confirmed and booking is now active!' });

    } catch (error) {
        next(error);
    }
};
