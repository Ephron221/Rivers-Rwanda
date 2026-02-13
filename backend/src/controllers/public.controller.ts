import { Request, Response, NextFunction } from 'express';
import { query } from '../database/connection';

export const getPublicStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [accommodationCount] = await query('SELECT COUNT(*) as count FROM accommodations');
    const [vehicleCount] = await query('SELECT COUNT(*) as count FROM vehicles');
    const [bookingCount] = await query('SELECT COUNT(*) as count FROM bookings');
    const [agentCount] = await query('SELECT COUNT(*) as count FROM users WHERE role = "agent" AND status = "active"');

    res.status(200).json({
      success: true,
      data: {
        accommodations: accommodationCount.count,
        vehicles: vehicleCount.count,
        bookings: bookingCount.count,
        agents: agentCount.count
      }
    });
  } catch (error) {
    next(error);
  }
};
