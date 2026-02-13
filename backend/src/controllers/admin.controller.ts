import { Request, Response, NextFunction } from 'express';
import { query } from '../database/connection';
import * as BookingModel from '../models/Booking.model';
import * as UserModel from '../models/User.model';
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
    
    // Create a data object that matches the Partial<User> type
    // and cast through any to satisfy the complex RowDataPacket requirement
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

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await BookingModel.getAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await BookingModel.updateBookingStatus(id, status);
    res.status(200).json({ success: true, message: `Booking ${status} successfully` });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [userCount] = await query('SELECT COUNT(*) as count FROM users');
    const [accommodationCount] = await query('SELECT COUNT(*) as count FROM accommodations');
    const [vehicleCount] = await query('SELECT COUNT(*) as count FROM vehicles');
    const [bookingCount] = await query('SELECT COUNT(*) as count FROM bookings');

    res.status(200).json({
      success: true,
      data: {
        users: userCount.count,
        accommodations: accommodationCount.count,
        vehicles: vehicleCount.count,
        bookings: bookingCount.count
      }
    });
  } catch (error) {
    next(error);
  }
};
