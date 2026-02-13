import { Request, Response, NextFunction } from 'express';
import * as BookingModel from '../models/Booking.model';
import { getClientIdByUserId } from '../models/User.model';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Get the correct Client Profile ID
    const clientId = await getClientIdByUserId(userId);
    if (!clientId) {
      return res.status(400).json({ success: false, message: 'Client profile not found' });
    }

    const bookingData = {
      ...req.body,
      client_id: clientId
    };

    await BookingModel.createBooking(bookingData);
    res.status(201).json({ success: true, message: 'Booking request submitted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const clientId = await getClientIdByUserId(userId);
    if (!clientId) {
        return res.status(400).json({ success: false, message: 'Client profile not found' });
    }

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
    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};
