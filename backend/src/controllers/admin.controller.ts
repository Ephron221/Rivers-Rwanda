import { Request, Response, NextFunction } from 'express';
import { query } from '../database/connection';
import * as BookingModel from '../models/Booking.model';
import * as UserModel from '../models/User.model';
import * as CommissionModel from '../models/Commission.model';
import { hashPassword } from '../utils/bcrypt.utils';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    await UserModel.createUser({
      email,
      password_hash: hashedPassword,
      role: role || 'client',
      status: 'active'
    });
    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;
    
    const updateData: any = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    await UserModel.updateUser(id, updateData);
    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await UserModel.deleteUser(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPendingAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sql = 'SELECT * FROM agents WHERE status = "pending"';
    const agents = await query(sql);
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

export const approveAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const sql = 'UPDATE agents SET status = "approved" WHERE id = ?';
    await query(sql, [id]);
    
    const userSql = 'UPDATE users SET status = "active", role = "agent" WHERE id = (SELECT user_id FROM agents WHERE id = ?)';
    await query(userSql, [id]);

    res.status(200).json({ success: true, message: 'Agent approved successfully' });
  } catch (error) {
    next(error);
  }
};

export const rejectAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const sql = 'UPDATE agents SET status = "rejected" WHERE id = ?';
    await query(sql, [id]);
    res.status(200).json({ success: true, message: 'Agent rejected' });
  } catch (error) {
    next(error);
  }
};

export const getAllSellers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sql = 'SELECT * FROM sellers';
        const sellers = await query(sql);
        res.status(200).json({ success: true, data: sellers });
    } catch (error) {
        next(error);
    }
};

export const approveSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const sql = 'UPDATE sellers SET status = "approved" WHERE id = ?';
        await query(sql, [id]);

        const userSql = 'UPDATE users SET status = "active" WHERE id = (SELECT user_id FROM sellers WHERE id = ?)';
        await query(userSql, [id]);

        res.status(200).json({ success: true, message: 'Seller approved successfully' });
    } catch (error) {
        next(error);
    }
};

export const rejectSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const sql = 'UPDATE sellers SET status = "rejected" WHERE id = ?';
        await query(sql, [id]);
        res.status(200).json({ success: true, message: 'Seller rejected' });
    } catch (error) {
        next(error);
    }
};

export const getPendingProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const houses = await query("SELECT id, title as name, 'house' as type, created_at FROM houses WHERE status = 'pending_approval'");
    const accommodations = await query("SELECT id, name, type, created_at FROM accommodations WHERE status = 'pending_approval'");
    const vehicles = await query("SELECT id, CONCAT(make, ' ', model) as name, 'vehicle' as type, created_at FROM vehicles WHERE status = 'pending_approval'");

    const pendingProducts = [...(houses as any[]), ...(accommodations as any[]), ...(vehicles as any[])];
    pendingProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.status(200).json({ success: true, data: pendingProducts });
  } catch (error) {
    next(error);
  }
};

const getTableNameFromType = (type: string): string | null => {
    const typeMap: { [key: string]: string } = {
        house: 'houses',
        accommodation: 'accommodations',
        vehicle: 'vehicles',
        apartment: 'accommodations',
        hotel_room: 'accommodations',
        event_hall: 'accommodations',
    };
    return typeMap[type] || null;
};

export const approveProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params;
    const tableName = getTableNameFromType(type);

    if (!tableName) {
        return res.status(400).json({ success: false, message: 'Invalid product type' });
    }

    const sql = `UPDATE ${tableName} SET status = 'available' WHERE id = ?`;
    await query(sql, [id]);

    res.status(200).json({ success: true, message: `Product approved successfully` });
  } catch (error) {
    next(error);
  }
};

export const rejectProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params;
    const tableName = getTableNameFromType(type);

    if (!tableName) {
        return res.status(400).json({ success: false, message: 'Invalid product type' });
    }

    const sql = `UPDATE ${tableName} SET status = 'rejected' WHERE id = ?`;
    await query(sql, [id]);

    res.status(200).json({ success: true, message: `Product rejected` });
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

export const approveBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await BookingModel.updateBookingStatus(id, 'approved');
    res.status(200).json({ success: true, message: 'Booking approved successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await BookingModel.updateBookingStatus(id, status);

    if (status === 'completed') {
      const [booking] = await query<BookingModel.Booking[]>('SELECT * FROM bookings WHERE id = ?', [id]);
      // This logic is now corrected to only create a commission if an agent is involved.
      if (booking && booking.agent_id) {
          const [agent] = await query<any[]>('SELECT commission_rate FROM agents WHERE id = ?', [booking.agent_id]);
          if (agent) {
            const commissionAmount = booking.total_amount * (agent.commission_rate / 100); // Agent's commission
            await CommissionModel.createCommission({
              agent_id: booking.agent_id,
              booking_id: id,
              amount: commissionAmount
            });
          }
      }
    }

    res.status(200).json({ success: true, message: `Booking ${status} successfully` });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await BookingModel.deleteBookingById(id);
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const verifyBookingPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    await query(`UPDATE payments SET status = 'completed', verified_at = CURRENT_TIMESTAMP WHERE booking_id = ?`, [bookingId]);
    await query(`UPDATE bookings SET payment_status = 'paid' WHERE id = ?`, [bookingId]);
    res.status(200).json({ success: true, message: 'Payment verified and booking updated.' });
  } catch (error) {
    next(error);
  }
};


export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [userCount] = await query('SELECT COUNT(*) as count FROM users');
    const [accommodationCount] = await query('SELECT COUNT(*) as count FROM accommodations');
    const [vehicleCount] = await query('SELECT COUNT(*) as count FROM vehicles');
    const [houseCount] = await query('SELECT COUNT(*) as count FROM houses');
    const [bookingCount] = await query('SELECT COUNT(*) as count FROM bookings');

    res.status(200).json({
      success: true,
      data: {
        users: userCount.count,
        accommodations: accommodationCount.count,
        vehicles: vehicleCount.count,
        houses: houseCount.count,
        bookings: bookingCount.count
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCommissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sql = `
      SELECT c.id, c.amount, c.status, c.earned_at, a.first_name, a.last_name, a.phone_number
      FROM commissions c
      JOIN agents a ON c.agent_id = a.id
      ORDER BY c.earned_at DESC
    `;
    const commissions = await query(sql);
    res.status(200).json({ success: true, data: commissions });
  } catch (error) {
    next(error);
  }
};

export const markCommissionAsPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const sql = 'UPDATE commissions SET status = "paid", paid_at = CURRENT_TIMESTAMP WHERE id = ?';
    await query(sql, [id]);
    res.status(200).json({ success: true, message: 'Commission marked as paid' });
  } catch (error) {
    next(error);
  }
};
