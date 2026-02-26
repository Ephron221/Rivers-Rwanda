import { Request, Response, NextFunction } from 'express';
import * as BookingModel from '../models/Booking.model';
import * as PaymentModel from '../models/Payment.model';
import * as AccommodationModel from '../models/Accommodation.model';
import * as VehicleModel from '../models/Vehicle.model';
import * as HouseModel from '../models/House.model';
import * as CommissionModel from '../models/Commission.model';
import { getClientIdByUserId } from '../models/User.model';
import { sendSaleConfirmationEmail } from '../services/email.service';
import QRCode from 'qrcode';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { query } from '../database/connection';

const getRelativePath = (fullPath: string): string => {
    const uploadsDir = 'uploads';
    const uploadsIndex = fullPath.indexOf(uploadsDir);
    if (uploadsIndex === -1) return fullPath; 
    const relativePath = fullPath.substring(uploadsIndex);
    return '/' + relativePath.replace(/\\/g, '/');
}

export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const clientId = await getClientIdByUserId(userId);
    if (!clientId) return res.status(404).json({ success: false, message: 'Client profile not found.' });

    if (!req.body.total_amount) {
        return res.status(400).json({ success: false, message: 'Total amount is required for booking.' });
    }

    const bookingData = { 
        ...req.body, 
        client_id: clientId,
        total_amount: parseFloat(req.body.total_amount)
    };
    
    const newBooking = await BookingModel.createBooking(bookingData);

    if (req.file) {
      await PaymentModel.createPayment({
        booking_id: newBooking.id,
        amount: newBooking.total_amount,
        payment_method: req.body.payment_method || 'bank_transfer',
        payment_proof_path: getRelativePath(req.file.path)
      });
    }
    
    res.status(201).json({ success: true, message: 'Booking created!', data: { bookingId: newBooking.id, bookingReference: newBooking.booking_reference } });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const details = await BookingModel.getBookingDetailsForInvoice(id);
        if (!details) return res.status(404).json({ success: false, message: 'Booking not found' });

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const url = new URL(`${baseUrl}/booking-details`);
        Object.entries(details).forEach(([key, value]) => url.searchParams.append(key, String(value)));

        const qrCodeImage = await QRCode.toDataURL(url.toString());
        res.status(200).json({ success: true, data: { ...details, qrCodeImage } });
    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const booking = await BookingModel.getBookingById(id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        // 1. Update Statuses
        await BookingModel.updateBookingStatus(id, 'confirmed');
        await BookingModel.updateBookingPaymentStatus(id, 'paid');
        await PaymentModel.updatePaymentStatusByBookingId(id, 'completed');

        // 2. Get Property Details and Seller Info
        let propertyName = "Property";
        let sellerId = booking.seller_id;

        if (booking.house_id) {
            const house = await HouseModel.getHouseById(booking.house_id);
            propertyName = house?.title || "House";
            if (!sellerId) sellerId = house?.seller_id;
            await HouseModel.updateHouseStatus(booking.house_id, booking.booking_type.includes('purchase') ? 'purchased' : 'rented');
        } else if (booking.accommodation_id) {
            const acc = await AccommodationModel.getAccommodationById(booking.accommodation_id);
            propertyName = acc?.name || "Accommodation";
            if (!sellerId) sellerId = acc?.seller_id;
            await AccommodationModel.updateAccommodationStatus(booking.accommodation_id, 'unavailable');
        } else if (booking.vehicle_id) {
            const veh = await VehicleModel.getVehicleById(booking.vehicle_id);
            propertyName = `${veh?.make} ${veh?.model}` || "Vehicle";
            if (!sellerId) sellerId = veh?.seller_id;
            await VehicleModel.updateVehicleStatus(booking.vehicle_id, booking.booking_type.includes('purchase') ? 'sold' : 'rented');
        }

        // 3. Commission Calculations
        const totalAmount = booking.total_amount;
        const systemCommission = totalAmount * 0.10; // System Owner 10%
        let agentCommission = 0;

        // Record Agent Commission if involved (Fixed 5%)
        if (booking.agent_id) {
            agentCommission = totalAmount * 0.05; 
            await CommissionModel.createCommission({
                booking_id: id,
                amount: agentCommission,
                commission_type: 'agent',
                agent_id: booking.agent_id,
                status: 'pending'
            });
        }

        // Record System Commission
        await CommissionModel.createCommission({
            booking_id: id,
            amount: systemCommission,
            commission_type: 'system',
            seller_id: sellerId,
            status: 'approved'
        });

        const netAmount = totalAmount - systemCommission - agentCommission;

        // 4. Send Email to Seller
        if (sellerId) {
            const [sellerUser] = await query<any[]>('SELECT email FROM users WHERE id = (SELECT user_id FROM sellers WHERE id = ?)', [sellerId]);
            if (sellerUser) {
                await sendSaleConfirmationEmail(sellerUser.email, {
                    propertyName,
                    amount: totalAmount,
                    commission: systemCommission + agentCommission,
                    netAmount: netAmount
                });
            }
        }

        res.status(200).json({ success: true, message: 'Payment confirmed, commissions recorded, and seller notified.' });
    } catch (error) {
        console.error("CONFIRM_PAYMENT_ERROR:", error);
        next(error);
    }
};

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookings = await BookingModel.getAllBookings();
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
    const clientId = await getClientIdByUserId(userId);
    if (!clientId) return res.status(404).json({ success: false, message: 'Client profile not found.' });
    const bookings = await BookingModel.getBookingsByClientId(clientId);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await BookingModel.updateBookingStatus(id, 'cancelled');
    res.status(200).json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    next(error);
  }
};
