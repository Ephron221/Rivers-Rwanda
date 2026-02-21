import { Request, Response, NextFunction } from 'express';
import * as BookingModel from '../models/Booking.model';
import * as PaymentModel from '../models/Payment.model';
import * as AccommodationModel from '../models/Accommodation.model';
import * as VehicleModel from '../models/Vehicle.model';
import * as HouseModel from '../models/House.model';
import { getClientIdByUserId } from '../models/User.model';
import QRCode from 'qrcode';

const getRelativePath = (fullPath: string): string => {
    const uploadsDir = 'uploads';
    const uploadsIndex = fullPath.indexOf(uploadsDir);
    if (uploadsIndex === -1) return fullPath; // Fallback
    const relativePath = fullPath.substring(uploadsIndex);
    return '/' + relativePath.replace(/\\/g, '/');
}

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

    const clientId = await getClientIdByUserId(userId);
    if (!clientId) return res.status(404).json({ success: false, message: 'Client profile not found.' });

    const bookingData = { ...req.body, client_id: clientId };
    const newBooking = await BookingModel.createBooking(bookingData);

    if (req.file) {
      await PaymentModel.createPayment({
        booking_id: newBooking.id,
        amount: newBooking.total_amount,
        payment_method: req.body.payment_method,
        payment_proof_path: getRelativePath(req.file.path)
      });
    }
    
    res.status(201).json({ success: true, message: 'Booking created!', data: { bookingReference: newBooking.booking_reference } });
  } catch (error) {
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
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // 1. Update Payment & Booking Status
        await BookingModel.updateBookingStatus(id, 'confirmed');
        await BookingModel.updateBookingPaymentStatus(id, 'paid');
        await PaymentModel.updatePaymentStatusByBookingId(id, 'completed');

        // 2. Update Inventory Status
        let newStatus = 'rented'; // Default for rentals
        if (booking.booking_type === 'house_purchase' || booking.booking_type === 'vehicle_purchase') {
            newStatus = 'purchased';
        }
        
        if (booking.accommodation_id) {
            await AccommodationModel.updateAccommodationStatus(booking.accommodation_id, 'unavailable');
        } else if (booking.vehicle_id) {
            await VehicleModel.updateVehicleStatus(booking.vehicle_id, newStatus);
        } else if (booking.house_id) {
            await HouseModel.updateHouseStatus(booking.house_id, newStatus);
        }

        res.status(200).json({ success: true, message: 'Payment confirmed and listing status updated.' });
    } catch (error) {
        next(error);
    }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
    const clientId = await getClientIdByUserId(userId);
    if (!clientId) return res.status(404).json({ success: false, message: 'Client profile not found' });
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
