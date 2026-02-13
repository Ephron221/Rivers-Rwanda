import { query } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface Booking extends RowDataPacket {
  id: string;
  booking_type: 'accommodation' | 'vehicle_rent' | 'vehicle_purchase';
  booking_reference: string;
  client_id: string;
  agent_id?: string;
  accommodation_id?: string;
  vehicle_id?: string;
  total_amount: number;
  booking_status: 'pending' | 'approved' | 'confirmed' | 'completed' | 'cancelled';
  created_at: Date;
}

const generateReference = () => {
  return 'RR' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const createBooking = async (data: any): Promise<void> => {
  const reference = generateReference();
  const sql = `
    INSERT INTO bookings (id, booking_type, booking_reference, client_id, agent_id, accommodation_id, vehicle_id, total_amount, booking_status)
    VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;
  await query(sql, [
    data.booking_type,
    reference,
    data.client_id,
    data.agent_id || null,
    data.accommodation_id || null,
    data.vehicle_id || null,
    data.total_amount
  ]);
};

export const getBookingsByClientId = async (clientId: string): Promise<Booking[]> => {
  const sql = 'SELECT * FROM bookings WHERE client_id = ? ORDER BY created_at DESC';
  return await query<Booking[]>(sql, [clientId]);
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const sql = 'SELECT * FROM bookings ORDER BY created_at DESC';
  return await query<Booking[]>(sql);
};

export const updateBookingStatus = async (id: string, status: string): Promise<void> => {
  const sql = 'UPDATE bookings SET booking_status = ? WHERE id = ?';
  await query(sql, [status, id]);
};
